import * as FileSystem from "expo-file-system";
import type { FeatureCollection } from "geojson";
import React, { useEffect, useRef, useState } from "react";

import parseGeoJsonAsync from "@/functions/jsonParse";

import FloorN_section from "./section";
import FloorN_unit from "./unit";

type Props = {
  floor_num: number;
};

type GeoData = {
  section: FeatureCollection;
  unit: FeatureCollection;
  stair: FeatureCollection;
};

export default function FloorN({ floor_num }: Props) {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);

  const cacheRef = useRef<{ [key: number]: GeoData }>({});

  useEffect(() => {
    // キャッシュがある場合は即座にセット
    if (cacheRef.current[floor_num]) {
      setGeoData(cacheRef.current[floor_num]);
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const cacheDir = `${FileSystem.documentDirectory}geoJson_cache`;
        const [sourceSection, sourceUnit, sourceStair] = await Promise.all([
          FileSystem.readAsStringAsync(`${cacheDir}/sections/floor${floor_num}.geojson`),
          FileSystem.readAsStringAsync(`${cacheDir}/units/floor${floor_num}.geojson`),
          FileSystem.readAsStringAsync(`${cacheDir}/others/stair.geojson`)
        ]);

        const [parsedSection, parsedUnit, parsedStair] = await Promise.all([
          parseGeoJsonAsync(sourceSection),
          parseGeoJsonAsync(sourceUnit),
          parseGeoJsonAsync(sourceStair)
        ]);

        const data: GeoData = {
          section: parsedSection,
          unit: parsedUnit,
          stair: parsedStair
        };

        // キャッシュに保存
        cacheRef.current[floor_num] = data;

        // state をまとめて更新
        setGeoData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [floor_num]);

  if (loading || !geoData) {
    return null; // ローディング中は null でも可、スピナーを入れても良い
  }

  return (
    <>
      <FloorN_section data={geoData.section} floor_num={floor_num} />
      <FloorN_unit
        data={geoData.unit}
        stairData={geoData.stair}
        floor_num={floor_num}
      />
    </>
  );
}
