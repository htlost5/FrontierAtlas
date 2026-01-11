// Maplibreベースのネイティブマップスクリーンコンポーネント
// フロア切り替え、ズームレベル管理、GeoJSONデータのロードとキャッシュを担当
import {
  BackgroundLayer,
  Camera,
  CameraRef,
  MapView,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import loadGeoJson from "@/functions/loadGeoJson";

import FloorN from "./MapSource/Floors/floor_n/floorN";
import Interact from "./MapSource/footprints/interact";
import Studyhall from "./MapSource/footprints/studyhall";
import Venue from "./MapSource/venue";

// マップスクリーンコンポーネントのプロパティ型定義
type MapScreenProps = {
  floor_num: number;
  cameraRef: React.RefObject<CameraRef | null>;
};

// マップの表示レベル（ズームに応じて詳細度を変える）
type DisplayLevel = 0 | 1 | 2;
// 0: 非表示, 1: 概要表示, 2: 詳細表示

// 施設全体のGeoJSONデータ型定義
type venueGeoData = {
  venue: FeatureCollection;
  studyhall: FeatureCollection;
  interact: FeatureCollection;
};

// 各フロアのGeoJSONデータ型定義（セクション、部屋、階段）
type floorGeoData = {
  section: FeatureCollection;
  unit: FeatureCollection;
  stair: FeatureCollection;
};

// マップ表示の地理的制約範囲（学校施設周辺に限定）
const restrict_bound = {
  ne: [139.677156, 35.496373],
  sw: [139.679823, 35.499171],
};

// ネイティブマップスクリーンのメインコンポーネント
function MapScreenNative({ floor_num, cameraRef }: MapScreenProps) {
  const [zoom, setZoom] = useState(17.2);
  const [display, setDisplay] = useState<DisplayLevel>(0);
  const [venueGeoData, setVenueGeoData] = useState<venueGeoData | null>(null);
  const [floorGeoData, setFloorGeoData] = useState<floorGeoData | null>(null);
  const [venueLoading, setVenueLoading] = useState(true);
  const [floorLoading, setFloorLoading] = useState(true);

  const cacheRef = useRef<{ [key: number]: floorGeoData }>({});

  useEffect(() => {
    const initCamera = () => {
      if (!cameraRef.current) {
        requestAnimationFrame(initCamera);
        return;
      }

      cameraRef.current.setCamera({
        centerCoordinate: [139.6784895108818, 35.49777179199512],
        zoomLevel: 17.2,
        animationDuration: 1000,
      });
    };

    initCamera();
  }, [cameraRef]);

  useEffect(() => {
    (async () => {
      try {
        const [venue, studyhall, interact] = await loadGeoJson([
          { type: "venue", feature: "venue" },
          { type: "studyhall", feature: "studyhall" },
          { type: "interact", feature: "interact" },
        ]);

        setVenueGeoData({ venue, studyhall, interact });
      } catch (e) {
        console.error("Failed to load GeoJSON:", e);
      } finally {
        setVenueLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // キャッシュがある場合は即座にセット
    if (cacheRef.current[floor_num]) {
      setFloorGeoData(cacheRef.current[floor_num]);
      setFloorLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [loadSection, loadUnit, loadStair] = await loadGeoJson([
          { type: "section", feature: `floor${floor_num}` },
          { type: "unit", feature: `floor${floor_num}` },
          { type: "others", feature: `stair` },
        ]);

        const data: floorGeoData = {
          section: loadSection,
          unit: loadUnit,
          stair: loadStair,
        };

        // キャッシュに保存
        cacheRef.current[floor_num] = data;

        // state をまとめて更新
        setFloorGeoData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setFloorLoading(false);
      }
    }

    loadData();
  }, [floor_num]);

  if (venueLoading || floorLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.container}
      onRegionIsChanging={(region) => {
        const currentZoom = region.properties.zoomLevel;
        setZoom(currentZoom);

        if (currentZoom < 17.9) {
          setDisplay(0);
        } else if (currentZoom < 19.4) {
          setDisplay(1);
        } else {
          setDisplay(2);
        }
      }}
    >
      <BackgroundLayer
        id="index-back"
        style={{
          backgroundColor: "#F6F7F9",
          backgroundOpacity: 1,
        }}
      />
      <Camera
        ref={cameraRef}
        maxZoomLevel={21.1}
        minZoomLevel={17.2}
        maxBounds={restrict_bound}
        animationDuration={1000}
      />
      {venueGeoData?.venue && <Venue data={venueGeoData.venue} />}
      {venueGeoData?.studyhall && <Studyhall data={venueGeoData.studyhall} />}
      {venueGeoData?.interact && <Interact data={venueGeoData.interact} />}
      {floorGeoData && (
        <FloorN
          floor_num={floor_num}
          geoData={floorGeoData}
          display={display}
          zoomLevel={zoom}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(MapScreenNative);
