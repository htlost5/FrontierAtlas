// マップ上のラベル表示設定の型定義: 部屋名・アイコンの表示/非表示を管理
/**
 * マップラベルの表示設定型
 * @property key - ラベルの一意識別子
 * @property filter - Maplibreのフィルター条件（特定の部屋のみ表示など）
 * @property iconVisible - アイコン表示フラグ
 * @property textVisible - テキスト（部屋名）表示フラグ
 * @property textColor - テキスト色（オプション、デフォルト: 黒）
 */
export type LavelConfig = {
  key: string;
  filter: any;
  iconVisible: boolean;
  textVisible: boolean;
  textColor?: string;
};
