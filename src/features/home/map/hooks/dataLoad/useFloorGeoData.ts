import type { FeatureCollection } from "geojson";
import { useGeoDataByLogicalId } from "./useGeoDataByLogicalId";

type FloorGeoData = {
  floorGeoData: {
    units: FeatureCollection | null;
    sections: FeatureCollection | null;
    stairs: FeatureCollection | null;
  };
  floorLoading: boolean;
  floorError: Error | null;
};

export function useFloorGeoData(floor_num: number): FloorGeoData {
  const unitId = `studyhall_units_floor${floor_num}`;
  const sectionId = `studyhall_sections_floor${floor_num}`;
  const stairId = `studyhall_units_stairs`;

  const units = useGeoDataByLogicalId(unitId);
  const sections = useGeoDataByLogicalId(sectionId);
  const stairs = useGeoDataByLogicalId(stairId);

  return {
    floorGeoData: {
        units: units.data,
        sections: sections.data,
        stairs: stairs.data
    },
    floorLoading: units.loading || sections.loading || stairs.loading,
    floorError: units.error ?? sections.error ?? stairs.error,
  };
}
