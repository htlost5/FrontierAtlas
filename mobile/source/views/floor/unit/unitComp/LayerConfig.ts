// マップレイヤー描画設定の型定義: 部屋の塗りつぶしと枠線の色をカテゴリごとに管理
/**
 * マップレイヤーの描画設定型
 * @property key - レイヤーの一意識別子
 * @property filter - Maplibreのフィルター条件（特定のカテゴリのみ描画など）
 * @property fillColor - 塗りつぶし色（HEXカラーコード）
 * @property lineColor - 枠線色（HEXカラーコード、オプション）
 */
export type LayerConfig = {
  key: string;
  filter: any;
  fillColor: string;
  lineColor?: string;
};
