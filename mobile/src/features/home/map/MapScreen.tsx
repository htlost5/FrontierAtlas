// マップ画面の描画とデータ読み込みを統合するコンポーネント。
import React, { useCallback, useMemo, useRef, useState } from "react";

import type { CameraRef } from "@maplibre/maplibre-react-native";

import { MapContainer } from "./components/MapContainer";
import { ErrorOverlay } from "./components/ErrorOverlay";
import { FullScreenLoading } from "./components/FullScreenLoading";

import { useDisplayLevel } from "./hooks/state/useDisplayLevel";
import { useMapContext } from "./hooks/state/useMapContext";

import { useBatchMapData } from "./hooks/dataLoad/useBatchMapData";

import type { CameraRegion } from "./types";
import { BuildingsView } from "./layers/buildings";
import { FloorView } from "./layers/floor";
import { VenueView } from "./layers/venue";
import { MapIconLabel } from "./renderers/MapIconLabel";
import { UnitSymbol } from "./renderers/UnitSymbol";
import { processUnitData } from "./renderers/processUnitData";

type Props = {
  cameraRef: React.RefObject<CameraRef | null>;
  retryKey?: number; // 外部からインクリメントして再マウントさせる
};

export function MapScreen({ cameraRef, retryKey = 0 }: Props) {
  const { floor, zoom, setZoom, colorTheme } = useMapContext();
  const displayMode = useDisplayLevel(zoom);
  const showBuildings = displayMode === "building";

  // 再試行用の内部カウンタ（useBatchMapData に渡して再フェッチをトリガー）
  const [retryCount, setRetryCount] = React.useState(0);
  // 派生状態 — floor / retryCount の組み合わせキーで dismiss を管理
  const [dismissedAtKey, setDismissedAtKey] = useState(0);
  const currentKey = floor * 1_000_000 + retryCount;
  const errorDismissed = dismissedAtKey === currentKey;

  const batchData = useBatchMapData(floor, retryCount);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);
  const handleDismiss = useCallback(() => {
    setDismissedAtKey(currentKey);
  }, [currentKey]);

  // processedGeoJson: UnitSymbol 用の表示ポイントデータ（MapIconLabel と共有）
  // REV-CRITICAL-1 fix: 早期リターン前に配置（Hooks ルール遵守）
  const processedUnitGeoJson = useMemo(
    () => processUnitData(batchData.floorData?.units ?? null),
    [batchData.floorData?.units],
  );

  // W19: 前回のズーム値を追跡
  const prevZoomRef = useRef<number | null>(null);
  const handleRegionIsChanging = useCallback(
    (region: CameraRegion) => {
      const z = region?.properties?.zoomLevel;
      const vb = region?.properties?.visibleBounds;
      if (typeof z === "number" && prevZoomRef.current !== z) {
        prevZoomRef.current = z;
        const ne = vb?.[0];
        const sw = vb?.[1];
        console.log("[zoom]", z, "bounds:", { ne, sw });
        setZoom(z);
      }
    },
    [setZoom],
  );

  // --- 3-State Rendering ---

  // State 1: 初回ロード中（MapContainer 非マウント）
  if (batchData.isInitialLoading) {
    return <FullScreenLoading />;
  }

  // State 2: 初回エラー（MapContainer 非マウント）
  if (
    batchData.state.status === "error" &&
    batchData.state.isInitial === true
  ) {
    const state = batchData.state as Extract<
      typeof batchData.state,
      { status: "error" }
    >;
    const errMsg = state.error.message;
    return (
      <ErrorOverlay
        variant="fullscreen"
        visible={true}
        message={errMsg}
        onRetry={handleRetry}
      />
    );
  }

  // State 3: データ完備 or フロア切替中 or フロア切替エラー
  // → MapContainer 常時マウント
  return (
    <MapContainer
      cameraRef={cameraRef}
      onRegionIsChanging={handleRegionIsChanging}
    >
      {/* フロア切替中オーバーレイ */}
      {batchData.isFloorSwitching && (
        <FullScreenLoading message="フロア切替中..." />
      )}

      {/* フロア切替エラーオーバーレイ */}
      {batchData.floorError && !errorDismissed && (
        <ErrorOverlay
          variant="overlay"
          visible={true}
          message={batchData.floorError.message}
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />
      )}

      {/* Venue レイヤー — floor 非依存（最背面） */}
      {batchData.venue && (
        <VenueView data={batchData.venue} colorTheme={colorTheme} />
      )}

      {/* Buildings レイヤー（床色）— section の下、venue の上 */}
      {batchData.buildings && (
        <BuildingsView
          data={batchData.buildings}
          visible={displayMode !== "building"}
          colorTheme={colorTheme}
          variant="floor"
        />
      )}

      {/* Floor レイヤー — floor 依存（stale-while-revalidate）
          グレーアウト制御: building モード時は visible=false → opacity 0 + 200ms transition */}
      {batchData.floorData && (
        <FloorView
          floorData={batchData.floorData}
          colorTheme={colorTheme}
          visible={displayMode !== "building"}
        />
      )}

      {/* 特殊シンボル（トイレ・EV・階段など）— 地物描画の上 */}
      {batchData.floorData && (
        <UnitSymbol
          pointData={processedUnitGeoJson}
          isVisible={displayMode !== "building" ? 1 : 0}
        />
      )}

      {/* ラベル — 通常の地物シンボル（特殊シンボル・ポリゴンの上に描画） */}
      {batchData.floorData && (
        <MapIconLabel
          floor_num={batchData.currentFloor}
          data={batchData.floorData.units}
          isVisible={displayMode !== "building"}
          colorTheme={colorTheme}
        />
      )}

      {/* Buildings レイヤー（グレーアウト用）— 最前面（building モードのみ表示） */}
      {batchData.buildings && (
        <BuildingsView
          data={batchData.buildings}
          visible={showBuildings}
          colorTheme={colorTheme}
        />
      )}
    </MapContainer>
  );
}
