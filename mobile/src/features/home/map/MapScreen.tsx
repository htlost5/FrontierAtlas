// マップ画面の描画とデータ読み込みを統合するコンポーネント。
import React, { useCallback, useEffect, useRef } from "react";
import { View, Pressable, Text } from "react-native";

import type { CameraRef } from "@maplibre/maplibre-react-native";

import { MapContainer } from "./components/MapContainer";
import { LoadingOverlay } from "./components/LoadingOverlay";

import { useDisplayLevel } from "./hooks/state/useDisplayLevel";
import { useMapContext } from "./hooks/state/useMapContext";

import { useFloorGeoData } from "./hooks/dataLoad/useFloorGeoData";
import { useMapGeoData } from "./hooks/dataLoad/useMapGeoData";

import type { CameraRegion } from "./types";
import { BuildingsView } from "./layers/buildings";
import { FloorView } from "./layers/floor";
import { VenueView } from "./layers/venue";
import { MapIconLabel } from "./renderers/MapIconLabel";

type Props = {
  cameraRef: React.RefObject<CameraRef | null>;
};

export function MapScreen({ cameraRef }: Props) {
  const { floor, zoom, setZoom } = useMapContext();
  const displayMode = useDisplayLevel(zoom);

  // modeのboolean変換
  const showBuildings = displayMode === "building";

  // キャッシュからデータロード
  const { venue, buildings, stairs, mapLoading, mapError } = useMapGeoData();
  const { floorGeoData, floorLoading, floorError } = useFloorGeoData(floor);

  // W19: 前回のズーム値を追跡し、実際に変更があったときだけ setZoom を呼ぶ
  const prevZoomRef = useRef<number | null>(null);

  // ズーム変更時の値更新
  const handleRegionIsChanging = useCallback(
    (region: CameraRegion) => {
      const z = region?.properties?.zoomLevel;
      if (typeof z === "number") {
        // W19: Only update if zoom actually changed
        if (prevZoomRef.current !== z) {
          prevZoomRef.current = z;
          setZoom(z);
        }
      }
    },
    [setZoom],
  );

  // TODO: 操作完了後の動作（zoomBoundary 使用時は useCameraController + handleRegionDidChange を有効化）

  // エラー出力 -> エラー時のスクリーンを実装する（フォールバック）
  const [hasFatalError, setHasFatalError] = React.useState(false);

  useEffect(() => {
    if (floorError) {
      console.error("Floor Error:", floorError);
      setHasFatalError(true);
    }
  }, [floorError]);

  useEffect(() => {
    if (mapError) {
      console.error("Map Error:", mapError);
      setHasFatalError(true);
    }
  }, [mapError]);

  // W16: Retry handler — resets error state to trigger reload
  const handleRetry = useCallback(() => {
    setHasFatalError(false);
  }, []);

  const isVenueReady = !mapLoading && venue && buildings;

  // W20: Separate floor readiness from stairs — floor renders even if stairs fail
  const isFloorDataReady =
    !floorLoading && floorGeoData?.units && floorGeoData?.sections;
  // C3: If fatal error, block all child rendering and show only error overlay
  if (hasFatalError) {
    return (
      <MapContainer
        cameraRef={cameraRef}
        onRegionIsChanging={handleRegionIsChanging}
      >
        <LoadingOverlay
          visible={true}
          message="データ読み込みエラー"
        />
        {/* W16: Retry button to re-trigger data loading */}
        <View style={{
          position: 'absolute',
          bottom: 100,
          alignSelf: 'center',
          backgroundColor: '#007AFF',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}>
          <Pressable onPress={handleRetry}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>再試行</Text>
          </Pressable>
        </View>
      </MapContainer>
    );
  }

  return (
    <MapContainer
      cameraRef={cameraRef}
      onRegionIsChanging={handleRegionIsChanging}
    >
      <LoadingOverlay
        visible={mapLoading || floorLoading}
        message={hasFatalError ? "データ読み込みエラー" : "読み込み中..."}
      />

      {isVenueReady && <VenueView data={venue} />}

      {/* W20: FloorView renders based on floorGeoData availability, not stairs */}
      {isFloorDataReady && (
        <FloorView floorData={floorGeoData} stairsData={stairs} />
      )}

      {/* ラベル表示: 詳細表示モード（detail）の場合のみ */}
      {isFloorDataReady && (
        <MapIconLabel
          floor_num={floor}
          data={floorGeoData.units}
          isVisible={displayMode === "detail"}
        />
      )}
      
      {isVenueReady && (
        <BuildingsView data={buildings} visible={showBuildings} />
      )}
    </MapContainer>
  );
}
