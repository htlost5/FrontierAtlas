// マップ画面の描画とデータ読み込みを統合するコンポーネント。
import React, { useCallback, useEffect, useRef } from "react";

import type { CameraRef } from "@maplibre/maplibre-react-native";

import { MapContainer } from "./components/MapContainer";
import { ErrorOverlay } from "./components/ErrorOverlay";
import { FullScreenLoading } from "./components/FullScreenLoading";

import { useDisplayLevel } from "./hooks/state/useDisplayLevel";
import { useMapContext } from "./hooks/state/useMapContext";

import { useBatchMapData } from "./hooks/dataLoad/useBatchMapData";

import type { CameraRegion } from "./types";
import { BuildingsView } from "./layers/buildings";
import { FloorView } from "./layers/floor";
import { VenueView } from "./layers/venue";
import { MapIconLabel } from "./renderers/MapIconLabel";

type Props = {
  cameraRef: React.RefObject<CameraRef | null>;
  retryKey?: number; // 外部からインクリメントして再マウントさせる
};

export function MapScreen({ cameraRef, retryKey = 0 }: Props) {
  const { floor, zoom, setZoom, colorTheme } = useMapContext();
  const displayMode = useDisplayLevel(zoom);
  const showBuildings = displayMode === "building";

  // 再試行用の内部カウンタ（useBatchMapData に渡して再フェッチをトリガー）
  const [retryCount, setRetryCount] = React.useState(0);
  // REV-CRITICAL-1 fix: dismiss 用の独立した状態
  const [errorDismissed, setErrorDismissed] = React.useState(false);
  const batchData = useBatchMapData(floor, retryCount);

  // floor または retry 変更時に dismiss 状態をリセット
  useEffect(() => {
    setErrorDismissed(false);
  }, [floor, retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);
  const handleDismiss = useCallback(() => {
    setErrorDismissed(true);
  }, []);

  // W19: 前回のズーム値を追跡
  const prevZoomRef = useRef<number | null>(null);
  const handleRegionIsChanging = useCallback(
    (region: CameraRegion) => {
      const z = region?.properties?.zoomLevel;
      if (typeof z === "number" && prevZoomRef.current !== z) {
        prevZoomRef.current = z;
        setZoom(z);
      }
    },
    [setZoom],
  );

  // --- 3-State Rendering ---

  // State 1: 初回ロード中（MapContainer 非マウント）
  if (batchData.isInitialLoading) {
    return <FullScreenLoading />;
  }

  // State 2: 初回エラー（MapContainer 非マウント）
  if (
    batchData.state.status === "error" &&
    batchData.state.isInitial === true
  ) {
    const state = batchData.state as Extract<
      typeof batchData.state,
      { status: "error" }
    >;
    const errMsg = state.error.message;
    return (
      <ErrorOverlay
        variant="fullscreen"
        visible={true}
        message={errMsg}
        onRetry={handleRetry}
      />
    );
  }

  // State 3: データ完備 or フロア切替中 or フロア切替エラー
  // → MapContainer 常時マウント
  return (
    <MapContainer
      cameraRef={cameraRef}
      onRegionIsChanging={handleRegionIsChanging}
    >
      {/* フロア切替中オーバーレイ */}
      {batchData.isFloorSwitching && (
        <FullScreenLoading message="フロア切替中..." />
      )}

      {/* フロア切替エラーオーバーレイ */}
      {batchData.floorError && !errorDismissed && (
        <ErrorOverlay
          variant="overlay"
          visible={true}
          message={batchData.floorError.message}
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />
      )}

      {/* Venue レイヤー — floor 非依存 */}
      {batchData.venue && (
        <VenueView data={batchData.venue} colorTheme={colorTheme} />
      )}

      {/* Floor レイヤー — floor 依存（stale-while-revalidate） */}
      {batchData.floorData && (
        <FloorView
          floorData={batchData.floorData}
          stairsData={batchData.stairs}
          colorTheme={colorTheme}
        />
      )}

      {/* MapIconLabel — currentFloor を使用 */}
      {batchData.floorData && (
        <MapIconLabel
          floor_num={batchData.currentFloor}
          data={batchData.floorData.units}
          isVisible={displayMode === "detail"}
          colorTheme={colorTheme}
        />
      )}

      {/* Buildings レイヤー — floor 非依存 */}
      {batchData.buildings && (
        <BuildingsView
          data={batchData.buildings}
          visible={showBuildings}
          colorTheme={colorTheme}
        />
      )}
    </MapContainer>
  );
}
