import geoJsonMap from "@/src/AppInit/loadAllGeoJson/geojsonAssetMap";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";
import type { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { getGeoDataByLogicalId } from "../../services/getGeoDataByLogicalId";

type GeoDataByLogicalId = {
  data: FeatureCollection | null;
  loading: boolean;
  error: Error | null;
};

export function useGeoDataByLogicalId(id: string): GeoDataByLogicalId {
  const isCached = geojsonRegistry.has(id) || !!geoJsonMap[id]?.content;

  const [data, setData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState<boolean>(!isCached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getGeoDataByLogicalId(id)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    data: data,
    loading: loading,
    error: error,
  };
}
