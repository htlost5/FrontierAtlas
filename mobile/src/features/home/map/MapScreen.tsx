// マップ画面の描画とデータ読み込みを統合するコンポーネント。
import React, { useCallback, useEffect } from "react";

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

  const isVenueReady = !mapLoading && venue && buildings;

  const isFloorReady =
    !floorLoading && floorGeoData?.units && floorGeoData?.sections && stairs;

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

      {isFloorReady && (
        <FloorView floorData={floorGeoData} stairsData={stairs} />
      )}

      {/* ラベル表示: 詳細表示モード（detail）の場合のみ */}
      {isFloorReady && (
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
