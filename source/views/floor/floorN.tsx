// フロアレイヤー統合コンポーネント: 指定フロアのセクション、部屋、ラベルを統合表示
import type { FeatureCollection } from "geojson";
import { LabelView } from "../../labels/label";
import { SectionView } from "./section/section";
import { UnitView } from "./unit/unitView";

/**
 * フロア表示コンポーネントのプロパティ型定義
 * @property floor_num - 表示する階層番号（1～5）
 * @property geoData - フロアのGeoJSONデータ（セクション、部屋、階段）
 * @property display - 表示詳細度レベル（0: 非表示, 1: 概要, 2: 詳細）
 * @property zoomLevel - 現在のズームレベル
 */
type Props = {
  floor_num: number;
  geoData: {
    unit: FeatureCollection;
    section: FeatureCollection;
    stair: FeatureCollection;
  };
  display: number;
  zoomLevel: number;
};

// フロアの全要素（セクション、部屋、ラベル）を統合して描画するメインコンポーネント
/**
 * フロア統合レンダリングコンポーネント
 * - セクション（廊下や共有スペース）のレイヤー
 * - ユニット（教室や部屋）のレイヤー
 * - ラベル（部屋名やアイコン）のレイヤー
 * をまとめて描画する
 * @param floor_num - 表示フロア番号
 * @param geoData - GeoJSONデータ
 * @param display - 表示詳細度
 * @returns フロア全体のレイヤー群
 */
export function FloorView({ floor_num, geoData, display }: Props) {
  if (!geoData) {
    return null; // ローディング中は null でも可、スピナーを入れても良い
  }

  return (
    <>
      <SectionView floor_num={floor_num} data={geoData.section} />
      <UnitView
        floor_num={floor_num}
        data={geoData.unit}
        stairData={geoData.stair}
      />
      <LabelView floor_num={floor_num} data={geoData.unit} display={display} />
    </>
  );
}
