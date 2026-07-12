// mapStyle — 空の MapLibre スタイル定義
//
// ## 設計
//
// 本スタイルは MapLibre のタイルソース・ベースレイヤーを一切持たない。
// GeoJSON データは <ShapeSource> コンポーネントで動的に注入される。
// 全レイヤー（PolygonLayer, SymbolLayer）は JSX で宣言する。
//
// ## FONT_STACK
//
// typography.ts から再エクスポート。全 MapLibre SymbolLayer は
// この FONT_STACK を参照すること。
//
// ## glyphs
//
// MapLibre Native SDK (Android/iOS) では glyphs の省略が未サポート
// (Style Spec で ❌ と明記、maplibre-native#165)。
// SymbolLayer の textFont と一致するフォントを指定すること。
//
// 2026-07-12: orangemug.github.io/font-glyphs → glyphs.geolonia.com に切替。
// orangemug の Noto Sans は CJK グリフがスタブ（13 bytes の空データ）のため。
// geolonia は Noto Sans CJK JP を提供し Latin と日本語の両方をカバー。

import { FONT_STACK } from "@/src/shared/constants/typography";

export { FONT_STACK };

/** MapLibre Style Specification — 使用するフィールドのみの最小型 */
type StyleSpec = {
  version: 8;
  name: string;
  glyphs: string;
  sources: Record<string, never>;
  layers: never[];
};

/** MapLibre の空スタイル（ベースマップなし・GeoJSON 動的注入） */
export const mapStyle: StyleSpec = {
  version: 8,
  name: "FrontierAtlas",
  glyphs: "https://glyphs.geolonia.com/{fontstack}/{range}.pbf",
  sources: {},
  layers: [],
};
