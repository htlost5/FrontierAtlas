// 部屋レイヤー設定: すべての部屋タイプの塗りつぶし色・枠線色を定義
/**
 * 部屋タイプの型定義（ROOM_FILTERS のキーに対応）
 */
import { LayerConfig } from "@/components/MapUI/unitComp/LayerConfig";
import { ROOM_FILTERS } from "../../filters/filters";

export type RoomKey = keyof typeof ROOM_FILTERS;

// 透明色定数: 特定の部屋タイプ（ロビー、ラウンジなど）を視覚的に非表示にする場合に使用
const TRANSPARENT = "rgba(0, 0, 0, 0)";

// 特定の部屋タイプの色設定をデフォルトから上書きするカスタマイズ定義
// - ロビー、ラウンジ、情報ラウンジ：透明（背景を見せる）
// - 中庭、テラス：特定の色（区別しやすくするため）
const overrides: Partial<Record<RoomKey, Partial<LayerConfig>>> = {
  lounge: {
    fillColor: TRANSPARENT,
    lineColor: TRANSPARENT,
  },
  lobby: {
    fillColor: TRANSPARENT,
    lineColor: TRANSPARENT,
  },
  courtyard: {
    fillColor: "#E6EDD6",
    lineColor: "#A8B996",
  },
  terrace: {
    fillColor: TRANSPARENT,
    lineColor: "rgba(0, 0, 0, 2)",
  },
  informationLounge: {
    fillColor: TRANSPARENT,
    lineColor: TRANSPARENT,
  },
};

// 部屋レイヤー設定を動的に生成（ROOM_FILTERS のすべてのキーに対応する色設定を作成）
// デフォルト色（#C7E6A1）を基準とし、overrides で特定部屋を上書き
function createRoomConfigs(): Record<RoomKey, LayerConfig> {
  return Object.fromEntries(
    // ROOM_FILTERS の各部屋タイプキーに対してLayerConfigを生成
    (Object.keys(ROOM_FILTERS) as RoomKey[]).map((key) => [
      key,
      {
        key,
        filter: ROOM_FILTERS[key], // 部屋タイプの描画フィルタ条件
        fillColor: "#C7E6A1", // デフォルト塗りつぶし色（薄い黄緑）
        lineColor: "#A8B996", // デフォルト枠線色（深い緑）
        ...overrides[key], // overrides が存在すればデフォルト値を上書き
      },
    ])
  ) as Record<RoomKey, LayerConfig>;
}

// マップ上で実際に使用される部屋レイヤー設定オブジェクト
// roomView.tsx で各部屋タイプのPolygonLayerを生成する際に参照
export const ROOM_CONFIGS: Record<RoomKey, LayerConfig> = createRoomConfigs();
