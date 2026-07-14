// ズームレベルに応じてマップ中心の許容範囲を動的に制御する。
// 高ズーム時ほど中心の許容範囲を狭め、施設全体が画面に収まるようにする。
// breakpoints の inset（メートル）から ne/sw を動的計算する。
import { mapConfig } from "../../../constants/mapConfig";
import { CameraAction } from "./types";

const { dynamicCenter } = mapConfig.restrict;
const { bounds } = mapConfig.restrict;

// メートル → 度 変換用の定数
const METERS_PER_DEG_LAT = 111_320;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** inset（メートル）から ne/sw 座標を計算する */
function insetToBounds(inset: number): {
  ne: [number, number];
  sw: [number, number];
} {
  const centerLat = (bounds.ne[1] + bounds.sw[1]) / 2;
  const metersPerDegLng =
    METERS_PER_DEG_LAT * Math.cos(centerLat * (Math.PI / 180));

  const insetDegLat = inset / METERS_PER_DEG_LAT;
  const insetDegLng = inset / metersPerDegLng;

  return {
    ne: [bounds.ne[0] - insetDegLng, bounds.ne[1] - insetDegLat],
    sw: [bounds.sw[0] + insetDegLng, bounds.sw[1] + insetDegLat],
  };
}

export const boundsBoundary: CameraAction = (camera, region) => {
  if (!dynamicCenter.enabled) return;

  const z = region?.properties?.zoomLevel;
  const center = region?.properties?.center;
  if (typeof z !== "number" || !center) return;

  const { breakpoints, animationDuration } = dynamicCenter;
  if (breakpoints.length < 2) return;

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

  // 補間係数 t（0～1）
  const t =
    hi.zoom !== lo.zoom
      ? Math.max(0, Math.min(1, (z - lo.zoom) / (hi.zoom - lo.zoom)))
      : 0;

  // inset から ne/sw を計算（補間対象は inset 値）
  const loBounds = insetToBounds(lo.inset);
  const hiBounds = insetToBounds(hi.inset);

  const neLng = lerp(loBounds.ne[0], hiBounds.ne[0], t);
  const neLat = lerp(loBounds.ne[1], hiBounds.ne[1], t);
  const swLng = lerp(loBounds.sw[0], hiBounds.sw[0], t);
  const swLat = lerp(loBounds.sw[1], hiBounds.sw[1], t);

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
