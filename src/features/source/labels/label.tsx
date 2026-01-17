// ラベル統合コンポーネント: 部屋アイコン・テキストラベル・特殊シンボルを一括管理
// MapLibreのImages、GeoJSONデータ型、各種ラベルコンポーネントをインポート
import { Images } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { UnitSymbol } from "./iconSources/unit/unit-label";
import { RoomLabel } from "./lavelUI/lavelView";

// 各部屋タイプのアイコン画像をインポート
import artRoom from "@/assets/images/icons/MapView/map/unitIcons/artRoom.png";
import audiovisualRoom from "@/assets/images/icons/MapView/map/unitIcons/audiovisualRoom.png";
import broadcastRoom from "@/assets/images/icons/MapView/map/unitIcons/broadcastRoom.png";
import calligraphyRoom from "@/assets/images/icons/MapView/map/unitIcons/calligraphyRoom.png";
import classroom from "@/assets/images/icons/MapView/map/unitIcons/classroom.png";
import conferenceRoom from "@/assets/images/icons/MapView/map/unitIcons/conferenceRoom.png";
import cookingRoom from "@/assets/images/icons/MapView/map/unitIcons/cookingRoom.png";
import craftRoom from "@/assets/images/icons/MapView/map/unitIcons/craftRoom.png";
import dressingRoom from "@/assets/images/icons/MapView/map/unitIcons/dressingRoom.png";
import itRoom from "@/assets/images/icons/MapView/map/unitIcons/itRoom.png";
import japaneseStyleRoom from "@/assets/images/icons/MapView/map/unitIcons/japaneseStyleRoom.png";
import laboratory from "@/assets/images/icons/MapView/map/unitIcons/laboratory.png";
import library from "@/assets/images/icons/MapView/map/unitIcons/library.png";
import lockerRoom from "@/assets/images/icons/MapView/map/unitIcons/lockerRoom.png";
import musicRoom from "@/assets/images/icons/MapView/map/unitIcons/musicRoom.png";
import nurseOffice from "@/assets/images/icons/MapView/map/unitIcons/nurseoffice.png";
import preparationRoom from "@/assets/images/icons/MapView/map/unitIcons/preparationRoom.png";
import printingRoom from "@/assets/images/icons/MapView/map/unitIcons/printingRoom.png";
import privateLounge from "@/assets/images/icons/MapView/map/unitIcons/privateLounge.png";
import sewingRoom from "@/assets/images/icons/MapView/map/unitIcons/sewingRoom.png";
import staffRoom from "@/assets/images/icons/MapView/map/unitIcons/staffRoom.png";
import storageRoom from "@/assets/images/icons/MapView/map/unitIcons/storageRoom.png";
import studyRoom from "@/assets/images/icons/MapView/map/unitIcons/studyRoom.png";
import wasteRoom from "@/assets/images/icons/MapView/map/unitIcons/wasteRoom.png";

/**
 * ラベル表示コンポーネントのプロパティ定義
 * @property floor_num - フロア番号
 * @property data - 部屋のGeoJSONデータ
 * @property display - 表示詳細度レベル（0: 非表示, 1: 概要, 2: 詳細）
 */
type Props = {
  floor_num: number;
  data: FeatureCollection | null;
  display: number;
};

/**
 * ラベル統合レンダリングコンポーネント
 * - 部屋タイプ別アイコン画像をMaplibreに登録（Images）
 * - 部屋ラベル（テキスト＋アイコン）を RoomLabel で描画
 * - 特殊シンボル（トイレ、エレベーターなど）を UnitSymbol で描画
 * @param floor_num - フロア番号
 * @param data - 部屋GeoJSONデータ
 * @param display - 表示詳細度レベル
 * @returns ラベル全体（Images + RoomLabel + UnitSymbol）
 */
export function LabelView({ floor_num, data, display }: Props) {
  // データが存在しない場合描画しない（エラー回避）
  if (!data) return null;

  // display_point（部屋の中心座標）をgeometryに設定してアイコン表示位置を決定
  const processedFeatures = data.features.map((f) => ({
    ...f,
    geometry: f.properties?.display_point,
  }));

  // 処理済みデータでGeoJSONオブジェクトを再構成
  const processedGeoJson = {
    ...data,
    features: processedFeatures,
  };

  const isVisible = display;

  return (
    <>
      {/* MapLibreで使用する部屋タイプアイコンを一括登録 */}
      <Images
        id="map-symbols"
        images={{
          classroom: classroom,
          studyRoom: studyRoom,
          library: library,
          laboratory: laboratory,
          preparationRoom: preparationRoom,
          itRoom: itRoom,
          artRoom: artRoom,
          calligraphyRoom: calligraphyRoom,
          craftRoom: craftRoom,
          sewingRoom: sewingRoom,
          homeEconomicsRoom: classroom,
          cookingRoom: cookingRoom,
          audiovisualRoom: audiovisualRoom,
          musicRoom: musicRoom,
          japaneseStyleRoom: japaneseStyleRoom,
          conferenceRoom: conferenceRoom,
          broadcastRoom: broadcastRoom,
          studioRoom: preparationRoom,
          staffRoom: staffRoom,
          office: preparationRoom,
          nurseOffice: nurseOffice,
          printingRoom: printingRoom,
          lockerRoom: lockerRoom,
          dressingRoom: dressingRoom,
          storageRoom: storageRoom,
          wasteRoom: wasteRoom,
          privateLounge: privateLounge,
        }}
      />
      {/* 各部屋のラベル（アイコン・テキスト）を描画 */}
      <RoomLabel floor_num={floor_num} data={data} />
      {/* トイレ・エレベータ・自販機などの特殊シンボルを描画 */}
      <UnitSymbol
        pointData={processedGeoJson}
        isVisible={isVisible}
        floor_num={floor_num}
      />
    </>
  );
}
