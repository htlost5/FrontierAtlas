import React, { useCallback, useEffect } from "react";

import type { CameraRef } from "@maplibre/maplibre-react-native";

import { MapContainer } from "./components/MapContainer";
import { mapConfig } from "./constants/mapConfig";

import { useMapContext } from "./hooks/MapContext/useMapContext";
import { useDisplayLevel } from "./hooks/MapDisplay/useDisplayLevel";

import { useFloorGeoData } from "./hooks/dataLoad/useFloorGeoData";
import { useMapGeoData } from "./hooks/dataLoad/useMapGeoData";

import { FloorView } from "@/source/views/floor/floorN";
import { Venue } from "@/source/views/ground/ground";

type Props = {
  floor_num: number;
  cameraRef: React.RefObject<CameraRef | null>;
};

export function MapScreen({ floor_num, cameraRef }: Props) {
  const { zoom } = useMapContext();
  const display = useDisplayLevel(zoom);

  // キャッシュからデータロード
  const { venue, studyhall, interact, mapLoading, mapError } = useMapGeoData();
  const { floorGeoData, floorLoading, floorError } = useFloorGeoData(floor_num);

  // maxとmin到達時のモーション
  const handleRegionIsChanging = useCallback(
    (region: any) => {
      const z = region?.properties?.zoomLevel;
      if (!cameraRef.current || typeof z !== "number") return;

      if (z < mapConfig.zoom.softMin) {
        cameraRef.current.setCamera({
          zoomLevel: mapConfig.zoom.softMin,
          animationDuration: 250,
        });
      }

      if (z > mapConfig.zoom.softMax) {
        cameraRef.current.setCamera({
          zoomLevel: mapConfig.zoom.softMax,
          animationDuration: 150,
        });
      }
    },
    [cameraRef],
  );

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

  const isVenueReady = !mapLoading && venue && studyhall && interact;

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
          <Venue data={venue} />
          <Venue data={studyhall} />
          <Venue data={interact} />
        </>
      )}

      {isFloorReady && (
        <FloorView
          floor_num={floor_num}
          geoData={{
            unit: floorGeoData.units!,
            section: floorGeoData.sections!,
            stair: floorGeoData.stairs!,
          }}
          display={display}
          zoomLevel={zoom}
        />
      )}
    </MapContainer>
  );
}
