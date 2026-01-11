// フィルタ定義ファイル: 基本要素（アトリウム、壁）のMaplibreフィルタを生成
/**
 * 基本要素のカテゴリマッピング
 * @property atrium - オープンスペース（吹き抜けなど）を表すカテゴリ値
 * @property wall - 壁・柱を表すカテゴリ値
 */
import { filterMaker } from "@/functions/MapView/filter";

const BASE_CATEGORIES = {
  atrium: "opentobelow",
  wall: "concrete",
};

/**
 * 基本要素フィルタ
 * - filterMaker でカテゴリマッピングから Maplibre フィルタ式を生成
 * - BASE_FILTERS.atrium, BASE_FILTERS.wall でそれぞれのフィルタを取得可能
 */
export const BASE_FILTERS = filterMaker(BASE_CATEGORIES);