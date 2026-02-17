import { PolygonLayer } from "../../../../components/mapComp/PolygonLayer";
import { BASE_CONFIGS } from "./styles";
import { BaseProps } from "./types";

export function BaseView({ data }: BaseProps) {
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
