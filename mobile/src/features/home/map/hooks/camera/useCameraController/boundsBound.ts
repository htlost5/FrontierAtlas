// ズームレベルに応じてマップ中心の許容範囲を動的に制御する。
// 高ズーム時ほど中心の許容範囲を狭め、施設全体が画面に収まるようにする。
// breakpoints の narrowBy（メートル）から ne/sw を動的計算する。
import { mapConfig } from "../../../constants/mapConfig";
import { CameraAction } from "./types";
import {
  toLocalXY,
  fromLocalXY,
} from "../../../../../../utils/coordinateTransform";

const { dynamicCenter } = mapConfig.restrict;
const { bounds } = mapConfig.restrict;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * maxBounds の各辺から narrowBy（メートル）分内側に狭めた ne/sw を計算する
 * @param narrowBy 各辺から内側に狭めるメートル数（0 以上）
 * @returns narrowed ne/sw（EPSG:4326）
 */
function narrowByToBounds(narrowBy: number): {
  ne: [number, number];
  sw: [number, number];
} {
  // maxBounds の両端点を LOCAL_XY に変換
  const [neX, neY] = toLocalXY(bounds.ne[0], bounds.ne[1]);
  const [swX, swY] = toLocalXY(bounds.sw[0], bounds.sw[1]);

  // LOCAL_XY 上の幅の半分から最大 narrowBy を算出
  const maxNarrow = Math.min((neX - swX) / 2, (neY - swY) / 2);

  // narrowBy を安全な範囲にクランプ
  const clampedNarrowBy = Math.max(0, Math.min(narrowBy, maxNarrow));
  if (narrowBy > maxNarrow) {
    console.warn(
      `[boundsBound] narrowBy (${narrowBy}m) exceeds half of bounds (${maxNarrow.toFixed(1)}m). Clamped.`,
    );
  }

  // 各辺から narrowBy 分内側に狭める
  // NE → 南西方向に移動（x,y ともに減算）
  // SW → 北東方向に移動（x,y ともに加算）
  const narrowedNE = fromLocalXY(neX - clampedNarrowBy, neY - clampedNarrowBy);
  const narrowedSW = fromLocalXY(swX + clampedNarrowBy, swY + clampedNarrowBy);

  return { ne: narrowedNE, sw: narrowedSW };
}

export const boundsBoundary: CameraAction = (camera, region) => {
  if (!dynamicCenter.enabled) return;

  const z = region?.properties?.zoomLevel;
  const center = region?.properties?.center;
  if (typeof z !== "number" || !center) return;

  const { breakpoints, animationDuration } = dynamicCenter;
  if (breakpoints.length === 0) return;

  // ブレークポイントが1つだけの場合 → その narrowBy を全ズーム範囲で適用
  let narrowBy: number;
  if (breakpoints.length === 1) {
    narrowBy = breakpoints[0].narrowBy;
  } else {
    // 現在のズーム値を含む隣接2ブレークポイントを見つける
    let lo = breakpoints[0];
    let hi = breakpoints[breakpoints.length - 1];

    for (let i = 0; i < breakpoints.length - 1; i++) {
      if (z >= breakpoints[i].zoom && z <= breakpoints[i + 1].zoom) {
        lo = breakpoints[i];
        hi = breakpoints[i + 1];
        break;
      }
    }

    // 補間係数 t（0～1）で narrowBy 値を補間
    const t =
      hi.zoom !== lo.zoom
        ? Math.max(0, Math.min(1, (z - lo.zoom) / (hi.zoom - lo.zoom)))
        : 0;

    narrowBy = lerp(lo.narrowBy, hi.narrowBy, t);
  }

  // 補間後の narrowBy から動的 bounds を計算
  const dynamicBounds = narrowByToBounds(narrowBy);
  const neLng = dynamicBounds.ne[0];
  const neLat = dynamicBounds.ne[1];
  const swLng = dynamicBounds.sw[0];
  const swLat = dynamicBounds.sw[1];

  // 現在の中心を許容範囲内にクランプ
  const clampedLng = Math.max(swLng, Math.min(neLng, center[0]));
  const clampedLat = Math.max(swLat, Math.min(neLat, center[1]));

  if (clampedLng !== center[0] || clampedLat !== center[1]) {
    camera.setCamera({
      centerCoordinate: [clampedLng, clampedLat],
      animationDuration,
    });
  }
};
