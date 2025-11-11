import type { FeatureCollection } from "geojson";
import React, { useEffect, useRef, useState } from "react";

import loadGeoJson from "@/functions/loadGeoJson";
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
        const [loadSection, loadUnit, loadStair] = await loadGeoJson([
          { type: "section", feature: `floor${floor_num}` },
          { type: "unit", feature: `floor${floor_num}` },
          { type: "others", feature: `stair` },
        ]);

        const data: GeoData = {
          section: loadSection,
          unit: loadUnit,
          stair: loadStair,
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
