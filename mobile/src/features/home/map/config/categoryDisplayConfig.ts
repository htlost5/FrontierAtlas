// category.json の表示ルールを GeoJSON カテゴリ値に紐付ける設定モジュール
// ROOM_CATEGORIES を単一ソースとし、GeoJSON 値 → category.json キーの逆引きマップを構築する。
import categoryJson from "@/category.json";
import { ROOM_CATEGORIES } from "@/src/features/home/map/layers/floor/unit/rooms/filter";

// ---------------------------------------------------------------------------
// 型定義
// ---------------------------------------------------------------------------

export type CategoryDisplayEntry = {
  visible: boolean;
  label: {
    icon: boolean;
    text: boolean;
  };
  poi: boolean;
};

/** category.json の完全な config 型 */
type CategoryConfig = {
  categories: Record<string, CategoryDisplayEntry>;
};

// ---------------------------------------------------------------------------
// カテゴリ設定の読み込み
// ---------------------------------------------------------------------------

const { categories: RAW_CATEGORIES } = categoryJson as CategoryConfig;

// ---------------------------------------------------------------------------
// 逆引きマップ: GeoJSON カテゴリ値 → category.json キー
// ROOM_CATEGORIES を単一ソースとして構築する（CATEGORY_CONFIG_TO_GEOJSON は削除）。
// ---------------------------------------------------------------------------

const GEOJSON_TO_CONFIG_KEY: Record<string, string> = {};
for (const [configKey, geoValue] of Object.entries(ROOM_CATEGORIES)) {
  GEOJSON_TO_CONFIG_KEY[geoValue] = configKey;
}

// ---------------------------------------------------------------------------
// 公開ヘルパー関数
// ---------------------------------------------------------------------------

/**
 * GeoJSON カテゴリ値に対応する category.json の表示設定を取得する。
 * マッピングが存在しない場合は undefined を返す。
 */
export function getCategoryConfig(
  geoJsonCategory: string,
): CategoryDisplayEntry | undefined {
  const configKey = GEOJSON_TO_CONFIG_KEY[geoJsonCategory];
  if (!configKey) return undefined;
  return RAW_CATEGORIES[configKey];
}

/**
 * ポリゴン可視性（visible）を取得する。デフォルト: true
 */
export function isFeatureVisible(geoJsonCategory: string): boolean {
  return getCategoryConfig(geoJsonCategory)?.visible ?? true;
}

/**
 * ラベルアイコンの可視性（label.icon）を取得する。デフォルト: true
 */
export function isLabelIconVisible(geoJsonCategory: string): boolean {
  return getCategoryConfig(geoJsonCategory)?.label?.icon ?? true;
}

/**
 * ラベルテキストの可視性（label.text）を取得する。デフォルト: true
 */
export function isLabelTextVisible(geoJsonCategory: string): boolean {
  return getCategoryConfig(geoJsonCategory)?.label?.text ?? true;
}

/**
 * POI アイコンの可視性（poi）を取得する。デフォルト: false
 */
export function isPoiVisible(geoJsonCategory: string): boolean {
  return getCategoryConfig(geoJsonCategory)?.poi ?? false;
}

/**
 * POI 表示（poi: true）が有効な全 GeoJSON カテゴリ値の配列を返す。
 * Maplibre の in-filter で使用する。ROOM_CATEGORIES を単一ソースとする。
 */
export function getPoiGeoJsonCategories(): string[] {
  const result: string[] = [];
  for (const [configKey, geoValue] of Object.entries(ROOM_CATEGORIES)) {
    if (RAW_CATEGORIES[configKey]?.poi) {
      result.push(geoValue);
    }
  }
  return result;
}
