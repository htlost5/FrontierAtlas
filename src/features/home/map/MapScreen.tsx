import React, { useCallback, useEffect } from "react";

import type { CameraRef } from "@maplibre/maplibre-react-native";

import { MapContainer } from "./components/MapContainer";

import { useDisplayLevel } from "./hooks/state/useDisplayLevel";
import { useMapContext } from "./hooks/state/useMapContext";

import { useFloorGeoData } from "./hooks/dataLoad/useFloorGeoData";
import { useMapGeoData } from "./hooks/dataLoad/useMapGeoData";

import { CameraRegion } from "./hooks/camera/useCameraController/types";
import { BuildingsView } from "./layers/buildings";
import { FloorView } from "./layers/floor";
import { VenueView } from "./layers/venue";

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

  // ズーム変更時の値更新
  const handleRegionIsChanging = useCallback(
    (region: CameraRegion) => {
      const z = region?.properties?.zoomLevel;
      if (typeof z === "number") {
        setZoom(z);
      }
    },
    [setZoom],
  );

  // 操作完了後の動作
  // const handleCamera = useCameraController(cameraRef, [zoomBoundary]);
  // const handleRegionDidChange = useCallback(
  //   (region: CameraRegion) => {
  //     handleCamera(region);
  //   },
  //   [handleCamera],
  // );

  // エラー出力 -> エラー時のスクリーンを実装する（フォールバック）
  useEffect(() => {
    if (floorError) {
      console.error("Floor Error:", floorError);
    }
  }, [floorError]);

  useEffect(() => {
    if (mapError) {
      console.error("Map Error:", mapError);
    }
  }, [mapError]);

  const isVenueReady = !mapLoading && venue && buildings;

  const isFloorReady =
    !floorLoading && floorGeoData?.units && floorGeoData?.sections && stairs;

  return (
    <MapContainer
      cameraRef={cameraRef}
      onRegionIsChanging={handleRegionIsChanging}
    >
      {isVenueReady && <VenueView data={venue} />}

      {isFloorReady && (
        <FloorView floorData={floorGeoData} stairsData={stairs} />
      )}
      
      {isVenueReady && (
        <BuildingsView data={buildings} visible={showBuildings} />
      )}
    </MapContainer>
  );
}
