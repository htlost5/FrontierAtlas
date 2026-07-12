// マップシンボルアイコン共通コンポーネント: アイコン画像の登録とSymbolLayer表示を共通化
import {
  Images,
  ShapeSource,
  SymbolLayer,
} from "@maplibre/maplibre-react-native";
import type { Expression } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { iconSizeExpression } from "../expressions/expressionHelpers";

type Props = {
  /** MapLibre Images のID */
  iconId: string;
  /** MapLibre SymbolLayer のID */
  layerId: string;
  /** ShapeSource のID */
  sourceId: string;
  /** アイコン画像名（SymbolLayerのiconImageに渡す値） */
  iconName: string;
  /** requireで読み込んだ画像アセット */
  iconImage: any;
  /** GeoJSON FeatureCollection データ */
  data: FeatureCollection;
  /** 表示フィルター条件 */
  filter?: Expression;
  /** アイコンサイズの基準倍率（デフォルト: 0.03） */
  iconSizeBase?: number;
  /** 表示/非表示（1: visible, 0: none） */
  isVisible: number;
};

/**
 * マップシンボルアイコン共通コンポーネント
 * - Images にアイコン画像を登録
 * - ShapeSource + SymbolLayer でアイコンを描画
 * - ズームレベルに応じたアイコンサイズの補間に対応
 */
export function MapSymbolIcon({
  iconId,
  layerId,
  sourceId,
  iconName,
  iconImage,
  data,
  filter,
  iconSizeBase = 0.03,
  isVisible,
}: Props) {
  return (
    <>
      <Images
        id={iconId}
        images={{
          [iconName]: iconImage,
        }}
      />
      <ShapeSource id={sourceId} shape={data}>
        <SymbolLayer
          id={layerId}
          filter={filter}
          style={{
            iconImage: iconName,
            iconSize: iconSizeExpression([
              [17, iconSizeBase * 0.5],
              [20, iconSizeBase * 3.7],
            ]),
            iconRotationAlignment: "auto",
            textRotationAlignment: "auto",
            visibility: isVisible ? "visible" : "none",
            iconAllowOverlap: true,
          }}
        />
      </ShapeSource>
    </>
  );
}
