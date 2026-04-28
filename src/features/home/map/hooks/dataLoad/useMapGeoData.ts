// マップ描画に必要な GeoJSON を logicalId 単位で取得し、画面用データへ集約する Hook です。
import type { FeatureCollection } from "geojson";
import { BuildingsData } from "../../layers/buildings/types";
import { useGeoDataByLogicalId } from "./useGeoDataByLogicalId";

const MAP_LOGICAL_IDS = {
  venue: "venue_venue",
  studyhall: "studyhall_footprint",
  interact: "interact_footprint",
  stair: "studyhall_stairs",
} as const;

type MapGeoData = {
  venue: FeatureCollection | null;
  buildings: BuildingsData;
  stairs: FeatureCollection | null;

  mapLoading: boolean;
  mapError: Error | null;
};

/**
 * マップに必要な複数データソースを統合し、表示用の loading/error を返します。
 * @returns 地図描画に必要な GeoJSON と統合状態。
 */
export function useMapGeoData(): MapGeoData {
  const venue = useGeoDataByLogicalId(MAP_LOGICAL_IDS.venue);
  const studyhall = useGeoDataByLogicalId(MAP_LOGICAL_IDS.studyhall);
  const interact = useGeoDataByLogicalId(MAP_LOGICAL_IDS.interact);
  const stairs = useGeoDataByLogicalId(MAP_LOGICAL_IDS.stair);

  const sources = [venue, studyhall, interact, stairs];

  const buildings: BuildingsData = {
    studyhall: studyhall.data,
    interact: interact.data,
  };

  return {
    venue: venue.data,
    buildings,
    stairs: stairs.data,
    mapLoading: sources.some((source) => source.loading),
    mapError: sources.find((source) => source.error)?.error ?? null,
  };
}
