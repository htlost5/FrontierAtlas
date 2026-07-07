// ラベル設定定義ファイル: マップ上のすべてのラベル表示設定を管理
// source/labels/lavelUI/configs/lavelConfigs.ts から移植
import { LavelConfig } from "@/src/features/home/map/renderers/labels/LavelConfig";
import { ROOM_FILTERS } from "@/src/features/home/map/layers/floor/unit/rooms/filter";

export type LavelKey = keyof typeof ROOM_FILTERS;

// 特定のラベルタイプの表示設定をカスタマイズするオーバーライド設定
const overrides: Partial<Record<LavelKey, Partial<LavelConfig>>> = {
  // 公共スペース：シンボルのみ表示、テキスト非表示
  lobby: {
    iconVisible: false,
  },
  lounge: {
    iconVisible: false,
  },
  informationLounge: {
    iconVisible: false,
  },
  courtyard: {
    iconVisible: false,
  },

  // テキストとアイコン両方非表示：トイレ、エレベータ、自販機、避難系
  restroomMale: {
    textVisible: false,
    iconVisible: false,
  },
  restroomFemale: {
    textVisible: false,
    iconVisible: false,
  },
  restroomAccessible: {
    textVisible: false,
    iconVisible: false,
  },
  elevator: {
    textVisible: false,
    iconVisible: false,
  },
  vendingArea: {
    textVisible: false,
    iconVisible: false,
  },
  emergencyArea: {
    iconVisible: false,
  },
};

/**
 * ラベル設定生成関数
 * - ROOM_FILTERS の各キーに対応するラベル設定を動的に生成
 * - overrides で特定のラベルタイプの設定をカスタマイズ
 */
function createLabelConfigs(): Record<LavelKey, LavelConfig> {
  return Object.fromEntries(
    (Object.keys(ROOM_FILTERS) as LavelKey[]).map((key) => [
      key,
      {
        key,
        filter: ROOM_FILTERS[key],
        textColor: "#000000",
        iconVisible: true,
        textVisible: true,
        ...overrides[key],
      },
    ]),
  ) as Record<LavelKey, LavelConfig>;
}

/**
 * 全ラベルの最終的な設定オブジェクト
 */
export const LAVEL_CONFIGS: Record<LavelKey, LavelConfig> =
  createLabelConfigs();
