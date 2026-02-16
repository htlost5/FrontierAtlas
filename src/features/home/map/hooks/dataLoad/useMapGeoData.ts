import type { FeatureCollection } from "geojson";
import { useGeoDataByLogicalId } from "./useGeoDataByLogicalId";
import { BuildingsData } from "../../layers/buildings/types";

type MapGeoData = {
  venue: FeatureCollection | null;
  buildings: BuildingsData;
  mapLoading: boolean;
  mapError: Error | null;
};

export function useMapGeoData(): MapGeoData {
  const venueId = `venue_venue`;
  const studyhallId = `studyhall_footprints_footprints`;
  const interactId = `interact_footprints_footprints`;

  const venue = useGeoDataByLogicalId(venueId);
  const studyhall = useGeoDataByLogicalId(studyhallId);
  const interact = useGeoDataByLogicalId(interactId);

  const buildings: BuildingsData = {
    studyhall: studyhall.data,
    interact: interact.data
  }

  // console.log(venue.data);

  return {
    venue: venue.data,
    buildings: buildings,
    mapLoading: venue.loading || studyhall.loading || interact.loading,
    mapError: venue.error ?? studyhall.error ?? interact.error,
  };
}
