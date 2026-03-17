import type { FeatureCollection } from "geojson";
import { useGeoDataByLogicalId } from "./useGeoDataByLogicalId";
import { BuildingsData } from "../../layers/buildings/types";

type MapGeoData = {
  venue: FeatureCollection | null;
  buildings: BuildingsData;
  stairs: FeatureCollection | null;
  
  mapLoading: boolean;
  mapError: Error | null;
};

export function useMapGeoData(): MapGeoData {
  const venueId = `venue_venue`;
  const studyhallId = `studyhall_footprints_footprints`;
  const interactId = `interact_footprints_footprints`;
  const stairId = `studyhall_units_stairs`;

  const venue = useGeoDataByLogicalId(venueId);
  const studyhall = useGeoDataByLogicalId(studyhallId);
  const interact = useGeoDataByLogicalId(interactId);
  const stairs = useGeoDataByLogicalId(stairId);

  const buildings: BuildingsData = {
    studyhall: studyhall.data,
    interact: interact.data,
  }

  // console.log(venue.data);

  return {
    venue: venue.data,
    buildings: buildings,
    stairs: stairs.data,
    mapLoading: venue.loading || studyhall.loading || interact.loading || stairs.loading,
    mapError: venue.error ?? studyhall.error ?? interact.error ?? stairs.error,
  };
}
