import type { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { loadGeoJson } from "../services/loadGeoJson";
import {
  getFloorCache,
  getVenueCache,
  hasFloorCache,
  hasVenueCache,
  setFloorCache,
  setVenueCache,
} from "./useMapCache";

type VenueGeoData = {
  venue?: FeatureCollection;
  studyhall?: FeatureCollection;
  interact?: FeatureCollection;
};

type FloorGeoData = {
  section?: FeatureCollection;
  unit?: FeatureCollection;
  stair?: FeatureCollection;
};

export function useMapGeoData(floor_num: number) {
  const [venueGeoData, setVenueGeoData] = useState<VenueGeoData | null>(null);
  const [floorGeoData, setFloorGeoData] = useState<FloorGeoData | null>(null);
  const [venueLoading, setVenueLoading] = useState(true);
  const [floorLoading, setFloorLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadVenue() {
      if (hasVenueCache()) {
        if (!mounted) return;
        setVenueGeoData(getVenueCache());
        setVenueLoading(false);
        return;
      }
      try {
        const [venue, studyhall, interact] = await loadGeoJson([
          { type: "venue", feature: "venue" },
          { type: "studyhall", feature: "studyhall" },
          { type: "interact", feature: "interact" },
        ]);
        const v = { venue, studyhall, interact };
        setVenueCache(v);
        if (!mounted) return;
        setVenueGeoData(v);
      } catch (e) {
        console.error("useMapGeoData: failed to load venue geojson", e);
      } finally {
        if (mounted) setVenueLoading(false);
      }
    }
    loadVenue();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadFloor() {
      if (hasFloorCache(floor_num)) {
        if (!mounted) return;
        setFloorGeoData(getFloorCache(floor_num));
        setFloorLoading(false);
        return;
      }
      try {
        const [section, unit, stair] = await loadGeoJson([
          { type: "section", feature: `floor${floor_num}` },
          { type: "unit", feature: `flor${floor_num}` },
          { type: "others", feature: `stair` },
        ]);
        const data = { section, unit, stair };
        setFloorCache(floor_num, data);
        if (!mounted) return;
        setFloorGeoData(data);
      } catch (e) {
        console.error("useMapGeoData: failed to load floor geojson", e);
      } finally {
        if (mounted) setFloorLoading(false);
      }
    }
    loadFloor();
    return () => {
      mounted = false;
    };
  }, [floor_num]);

  return {
    venueGeoData,
    floorGeoData,
    venueLoading,
    floorLoading,
  };
}
