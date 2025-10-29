import { useEffect, useState } from "react";

import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import type { FeatureCollection } from "geojson";

export default function useLoadGeoJson(originGeoJson: any) {
    const [geoJson, setGeoJson] = useState<FeatureCollection | null >(
        null
    );
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGeo() {
            try {
                const asset = Asset.fromModule(originGeoJson);
                await asset.downloadAsync();
                const text = await FileSystem.readAsStringAsync(asset.localUri!);
                const geojson = JSON.parse(text) as FeatureCollection;
                setGeoJson(geojson);
            } catch (e: any) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        }
        loadGeo();
    }, [originGeoJson]);

    return { geoJson, loading, error };
}