import React, { useEffect } from "react";

import type { CameraRef } from "@maplibre/maplibre-react-native";

import { MapContainer } from "./components/MapContainer";

import { useDisplayLevel } from "./hooks/state/useDisplayLevel";
import { useMapContext } from "./hooks/state/useMapContext";

import { useFloorGeoData } from "./hooks/dataLoad/useFloorGeoData";
import { useMapGeoData } from "./hooks/dataLoad/useMapGeoData";

import { useZoomBoundary } from "./hooks/camera/useZoomBoundary";
import { BuildingsView } from "./layers/buildings";
import { FloorView } from "./layers/floor";
import { VenueView } from "./layers/venue";

type Props = {
  floor_num: number;
  cameraRef: React.RefObject<CameraRef | null>;
};

export function MapScreen({ floor_num, cameraRef }: Props) {
  const { zoom } = useMapContext();
  const display = useDisplayLevel(zoom);

  // キャッシュからデータロード
  const { venue, buildings, mapLoading, mapError } = useMapGeoData();
  const { floorGeoData, floorLoading, floorError } = useFloorGeoData(floor_num);

  // maxとmin到達時のモーション受け取り
  const handleRegionIsChanging = useZoomBoundary(cameraRef);

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
    !floorLoading &&
    floorGeoData?.units &&
    floorGeoData?.sections &&
    floorGeoData?.stairs;

  return (
    <MapContainer
      cameraRef={cameraRef}
      onRegionIsChanging={handleRegionIsChanging}
    >
      {isVenueReady && (
        <>
          <VenueView data={venue} />
          <BuildingsView data={buildings} />
        </>
      )}

      {isFloorReady && (
        <>
          <FloorView data={floorGeoData} />
        </>
      )}
    </MapContainer>
  );
}
