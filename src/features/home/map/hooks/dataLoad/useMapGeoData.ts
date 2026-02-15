import type { FeatureCollection } from "geojson";
import { useGeoDataByLogicalId } from "./useGeoDataByLogicalId";

type MapGeoData = {
  venue: FeatureCollection | null;
  studyhall: FeatureCollection | null;
  interact: FeatureCollection | null;
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

  // console.log(venue.data);

  return {
    venue: venue.data,
    studyhall: studyhall.data,
    interact: interact.data,
    mapLoading: venue.loading || studyhall.loading || interact.loading,
    mapError: venue.error ?? studyhall.error ?? interact.error,
  };
}
