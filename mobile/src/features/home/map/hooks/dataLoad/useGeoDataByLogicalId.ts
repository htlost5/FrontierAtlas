// useGeoDataByLogicalId 用のカスタムHookを定義する。
import { MapId } from "@/src/data/geojson/geojsonAssetMap";
import type { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { getGeoDataByLogicalId } from "../../services/getGeoDataByLogicalId";

type GeoDataByLogicalId = {
  data: FeatureCollection | null;
  loading: boolean;
  error: Error | null;
};

export function useGeoDataByLogicalId(id: MapId): GeoDataByLogicalId {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
