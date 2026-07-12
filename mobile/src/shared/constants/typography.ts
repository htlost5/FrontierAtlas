/**
 * typography — アプリ全体のフォント設定の単一情報源
 *
 * ## 設計
 *
 * 本アプリのフォント体系は 2 つのドメインに分離される：
 *
 * ### 1. APP_FONTS — React Native <Text> 用
 * expo-font で読み込むカスタムフォント（OTF/TTF）のファミリー名。
 * 全 <Text> コンポーネントの fontFamily はここから参照すること。
 *
 * ### 2. FONT_STACK — MapLibre SymbolLayer 用
 * MapLibre の glyph サーバ（glyphs.geolonia.com）が提供するフォント。
 * geolonia は "Noto Sans CJK JP" ファミリーを提供（Regular, Bold 等）。
 * CJK 日本語グリフ対応のため orangemug.github.io/font-glyphs から切り替え。
 * textFont プロパティに指定する値であり、React Native の fontFamily とは無関係。
 *
 * ⚠ geolonia はスタティックホスティングのため、フォント配列は必ず
 * 単一要素にすること（複数指定すると 404）。
 *
 * ### 3. FONT_SIZE — タイポグラフィスケール
 * 全コンポーネントで統一されたフォントサイズ体系。
 */

// ---- React Native <Text> 用カスタムフォント ----
export const APP_FONTS = {
  /** メイン表示用フォント（Y1LunaChord.otf） */
  lunaChord: "Y1LunaChord",
} as const;

// ---- MapLibre glyph サーバ用フォントスタック ----
// glyphs.geolonia.com が提供する "Noto Sans CJK JP" ファミリー。
// Latin (0-255) と CJK 日本語グリフを両方提供する。
//
// geolonia はスタティックホスティングのため、フォント配列は
// 必ず単一要素にすること（複数指定すると 404）。
// https://github.com/geolonia/glyphs.geolonia.com
export const FONT_STACK: {
  readonly DEFAULT: string[];
  readonly MEDIUM: string[];
  readonly BOLD: string[];
} = {
  DEFAULT: ["Noto Sans CJK JP Regular"],
  MEDIUM: ["Noto Sans CJK JP Regular"],
  BOLD: ["Noto Sans CJK JP Bold"],
};

// ---- タイポグラフィスケール ----
export const FONT_SIZE = {
  /** タブラベル（TabItem） */
  tab: 10,
  /** フロア切替ボタン */
  floorControl: 14,
  /** 本文 / ローディング / エラーメッセージ */
  body: 16,
  /** 検索結果サブ */
  bodyLarge: 18,
  /** 画面見出し / ダミーページ */
  heading: 20,
  /** 検索バー / 検索結果メイン */
  searchBar: 22,
  /** エラーアイコン */
  errorIcon: 48,
  /** オーバーレイメッセージ/ボタン */
  overlay: 10,
} as const;
