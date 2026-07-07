// bases の公開エクスポートをまとめる。
import { PolygonLayer } from "../../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../../types";
import { BASE_CONFIGS } from "./configs";

export function BaseView({ data }: GeoLayerProps) {
  if (!data) return null;

  return (
    <>
      {Object.entries(BASE_CONFIGS).map(([key, config]) => {
        return (
          <PolygonLayer
            key={key}
            prefixId={`units_base_${key}`}
            data={data}
            filter={config.filter}
            fillStyle={config.fillStyle}
            lineStyle={config.lineStyle}
          />
        );
      })}
    </>
  );
}
