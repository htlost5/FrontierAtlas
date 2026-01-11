// ラベル設定定義ファイル: マップ上のすべてのラベル表示設定を管理
/**
 * マップに表示されるラベルタイプの型定義（ROOM_FILTERS のキーに対応）
 */
import { LavelConfig } from "@/components/MapUI/lavelComp/LavelConfig";
import { ROOM_FILTERS } from "../../../floorView/unitSource/02_room/filters/filters";

export type LavelKey = keyof typeof ROOM_FILTERS;

// 特定のラベルタイプの表示設定をカスタマイズするオーバーライド設定
// 例：ロビーはテキストを表示しないなど、デフォルト値から外れた設定を定義
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
 * （例: ロビーはテキスト非表示、トイレはアイコン非表示など）
 * @returns ラベルタイプごとの設定オブジェクト
 */
function createLabelConfigs(): Record<LavelKey, LavelConfig> {
  return Object.fromEntries(
    (Object.keys(ROOM_FILTERS) as LavelKey[]).map((key) => [
      key,
      {
        key,
        filter: ROOM_FILTERS[key],
        textColor: "#000000", // デフォルトのテキスト色は黒
        iconVisible: true, // デフォルトではアイコンを表示
        textVisible: true, // デフォルトではテキストを表示
        ...overrides[key], // オーバーライド設定をマージして必要に応じて上書き
      },
    ])
  ) as Record<LavelKey, LavelConfig>;
}

/**
 * 全ラベルの最終的な設定オブジェクト
 * - createLabelConfigs() で動的に生成した、すべてのラベルタイプの設定を含む
 */
export const LAVEL_CONFIGS: Record<LavelKey, LavelConfig> =
  createLabelConfigs();
