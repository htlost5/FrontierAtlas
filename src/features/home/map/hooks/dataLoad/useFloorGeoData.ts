// useFloorGeoData 用のカスタムHookを定義する。
import { MapId } from "@/src/data/geojson/geojsonAssetMap";
import type { FeatureCollection } from "geojson";
import { useGeoDataByLogicalId } from "./useGeoDataByLogicalId";

type FloorGeoData = {
  floorGeoData: {
    units: FeatureCollection | null;
    sections: FeatureCollection | null;
  };
  floorLoading: boolean;
  floorError: Error | null;
};

export function useFloorGeoData(floor_num: number): FloorGeoData {
  const unitId = `studyhall_units_floor${floor_num}` as MapId;
  const sectionId = `studyhall_sections_floor${floor_num}` as MapId;

  const units = useGeoDataByLogicalId(unitId);
  const sections = useGeoDataByLogicalId(sectionId);

  return {
    floorGeoData: {
      units: units.data,
      sections: sections.data,
    },
    floorLoading: units.loading || sections.loading,
    floorError: units.error ?? sections.error,
  };
}
