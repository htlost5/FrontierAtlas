import type { FeatureCollection } from "geojson";
import { useEffect, useRef, useState } from "react";
import type { MapId } from "@/src/data/geojson/geojsonAssetMap";
import type { BuildingsData } from "../../layers/buildings/types";
import { getGeoDataByLogicalId } from "../../services/getGeoDataByLogicalId";
import { GeojsonRepository } from "@/src/data/geojson/repository/GeojsonRepository";
import { sanitizeFeatureCollection } from "@/src/infra/geojson/sanitizeGeoJSON";
import { geoJsonMap } from "@/src/data/geojson/geojsonAssetMap";

// ---- プリロードキャッシュ ----
// モジュールスコープに保持。コンポーネントのアンマウント/マウントを超えて生存。

type PreloadCache = {
  data: Map<number, FloorGeoData>;
  status: "idle" | "loading" | "ready" | "error";
};

const preloadCache: PreloadCache = {
  data: new Map(),
  status: "idle",
};

// ---- 公開型 ----
export type FloorGeoData = {
  readonly units: FeatureCollection | null;
  readonly surface: FeatureCollection | null; // [NEW]
  readonly underlaySurface: FeatureCollection | null; // [NEW] 4F/5F only
};

export type BatchState =
  | { readonly status: "loading"; readonly isInitial: true }
  | { readonly status: "loading"; readonly isInitial: false }
  | { readonly status: "ready" }
  | {
      readonly status: "error";
      readonly error: Error;
      readonly isInitial: boolean;
    };

export type BatchMapData = {
  readonly venue: FeatureCollection | null;
  readonly buildings: BuildingsData | null;
  readonly stairs: FeatureCollection | null;
  readonly floorData: FloorGeoData | null;
  readonly currentFloor: number;
  readonly state: BatchState;
  readonly isInitialLoading: boolean;
  readonly isFloorSwitching: boolean;
  readonly floorError: Error | null;
  readonly isPreloaded: boolean;
};

// ---- 内部型 ----
type VenueCache = {
  readonly venue: FeatureCollection;
  readonly buildings: BuildingsData;
  readonly stairs: FeatureCollection;
};

// ---- 定数 ----
const MAP_LOGICAL_IDS = {
  venue: "venue_venue" as MapId,
  studyhall: "studyhall_footprint" as MapId,
  interact: "interact_footprint" as MapId,
  stair: "studyhall_stairs" as MapId,
} as const;

function floorUnitId(floor: number): MapId {
  return `studyhall_units_floor${floor}` as MapId;
}
function floorSurfaceId(floor: number): MapId {
  return `studyhall_surface_floor${floor}` as MapId;
}

// ---- プリロード関数 ----
// 全5フロアの units + surface をバッチプリロード
// getMany() を使用し、1回のネイティブ呼び出しに集約（同時実行による NativeDatabase クラッシュ対策）
async function preloadAllFloors(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  if (preloadCache.status === "ready" || preloadCache.status === "loading") {
    return;
  }
  preloadCache.status = "loading";

  const floors = [1, 2, 3, 4, 5];
  const allIds = floors.flatMap((f) => [floorUnitId(f), floorSurfaceId(f)]);
  // 10 records: 5 floors × (units + surface)

  try {
    // バッチ取得: 全フロア × 2（units + surface）= 10 レコードを 1 回の SQLite 呼び出しで取得
    const repo = GeojsonRepository.getInstance();
    const batchResult = await repo.getMany(allIds);

    floors.forEach((floor, i) => {
      const unitId = floorUnitId(floor);
      const surfaceId = floorSurfaceId(floor);

      let units = batchResult.get(unitId) ?? null;
      let surface = batchResult.get(surfaceId) ?? null;

      // SQLite ミス時のアセットバンドルフォールバック
      if (!units) {
        const asset = geoJsonMap[unitId];
        if (asset)
          units = sanitizeFeatureCollection(asset.content as FeatureCollection);
      } else {
        units = sanitizeFeatureCollection(units);
      }

      if (!surface) {
        const asset = geoJsonMap[surfaceId];
        if (asset)
          surface = sanitizeFeatureCollection(
            asset.content as FeatureCollection,
          );
      } else {
        surface = sanitizeFeatureCollection(surface);
      }

      preloadCache.data.set(floor, {
        units,
        surface,
        underlaySurface: null,
      });
      onProgress?.(i + 1, floors.length);
    });

    // 4F / 5F の underlaySurface を 3F の surface で設定
    const floor3Data = preloadCache.data.get(3);
    if (floor3Data?.surface) {
      for (const f of [4, 5]) {
        const existing = preloadCache.data.get(f);
        if (existing) {
          preloadCache.data.set(f, {
            ...existing,
            underlaySurface: floor3Data.surface,
          });
        }
      }
    }

    preloadCache.status = "ready";
  } catch (e) {
    preloadCache.status = "error";
    console.warn("[preloadAllFloors] Preload failed:", e);
  }
}

export function useBatchMapData(
  floor: number,
  retryKey?: number,
): BatchMapData {
  const cacheRef = useRef<VenueCache | null>(null);

  const [state, setState] = useState<BatchState>({
    status: "loading",
    isInitial: true,
  });
  const [venue, setVenue] = useState<FeatureCollection | null>(null);
  const [buildings, setBuildings] = useState<BuildingsData | null>(null);
  const [stairs, setStairs] = useState<FeatureCollection | null>(null);
  const [floorData, setFloorData] = useState<FloorGeoData | null>(null);
  // stale-while-revalidate: 前フロアデータを保持
  const [previousFloorData, setPreviousFloorData] =
    useState<FloorGeoData | null>(null);

  // retryKey 変更時にキャッシュをリセット
  const prevRetryKeyRef = useRef<number | undefined>(retryKey);
  useEffect(() => {
    if (
      retryKey !== undefined &&
      prevRetryKeyRef.current !== undefined &&
      prevRetryKeyRef.current !== retryKey
    ) {
      cacheRef.current = null;
      setPreviousFloorData(null);
    }
    prevRetryKeyRef.current = retryKey;
  }, [retryKey]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      const isInitial = cacheRef.current === null;
      setState({ status: "loading", isInitial } as BatchState);

      try {
        // --- 1. floor 非依存データ（初回のみ取得） ---
        let v: FeatureCollection;
        let b: BuildingsData;
        let s: FeatureCollection;

        if (cacheRef.current === null) {
          const results = await Promise.all([
            getGeoDataByLogicalId(MAP_LOGICAL_IDS.venue),
            getGeoDataByLogicalId(MAP_LOGICAL_IDS.studyhall),
            getGeoDataByLogicalId(MAP_LOGICAL_IDS.interact),
            getGeoDataByLogicalId(MAP_LOGICAL_IDS.stair),
          ]);
          if (signal.aborted) return;

          v = results[0];
          b = { studyhall: results[1], interact: results[2] };
          s = results[3];
          cacheRef.current = { venue: v, buildings: b, stairs: s };
        } else {
          v = cacheRef.current.venue;
          b = cacheRef.current.buildings;
          s = cacheRef.current.stairs;
        }

        // --- 2. floor 依存データ ---
        // プリロードキャッシュがあれば SQLite I/O をスキップ
        let newFloorData: FloorGeoData;

        if (preloadCache.data.has(floor)) {
          newFloorData = preloadCache.data.get(floor)!;
        } else {
          const [units, surface] = await Promise.all([
            getGeoDataByLogicalId(floorUnitId(floor)),
            getGeoDataByLogicalId(floorSurfaceId(floor)),
          ]);
          if (signal.aborted) return;

          // 4F/5F の underlaySurface を 3F surface で設定
          let underlaySurface: FeatureCollection | null = null;
          if (floor === 4 || floor === 5) {
            const floor3Surface = preloadCache.data.get(3)?.surface;
            if (floor3Surface) {
              underlaySurface = floor3Surface;
            }
          }
          newFloorData = { units, surface, underlaySurface };
        }

        // --- 3. 状態更新 ---
        if (!signal.aborted) {
          setPreviousFloorData(newFloorData);
          setVenue(v);
          setBuildings(b);
          setStairs(s);
          setFloorData(newFloorData);
          setState({ status: "ready" });
        }
      } catch (e) {
        if (signal.aborted) return;
        setState({ status: "error", error: e as Error, isInitial });
      }
    })();

    return () => controller.abort();
  }, [floor, retryKey]);

  // 派生フラグ
  const isInitialLoading =
    state.status === "loading" && state.isInitial === true;
  // プリロードキャッシュヒット時はフロア切替中扱いにしない（瞬時切替）
  const isFloorSwitching =
    state.status === "loading" &&
    state.isInitial === false &&
    !preloadCache.data.has(floor);
  const floorError =
    state.status === "error" && !state.isInitial
      ? (state as Extract<BatchState, { status: "error" }>).error
      : null;

  // stale-while-revalidate: 前フロアデータを floorData が null のときに表示用として返す
  const displayFloorData = floorData ?? previousFloorData;

  // 初回ロード完了後にプリロード開始
  useEffect(() => {
    if (state.status === "ready" && preloadCache.status === "idle") {
      preloadAllFloors();
    }
  }, [state.status]);

  return {
    venue,
    buildings,
    stairs,
    floorData: displayFloorData,
    currentFloor: floor,
    state,
    isInitialLoading,
    isFloorSwitching,
    floorError,
    isPreloaded: preloadCache.status === "ready",
  };
}
