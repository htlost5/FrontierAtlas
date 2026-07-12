// bases の公開エクスポートをまとめる。
import { PolygonLayer } from "../../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../../types";
import { getBaseConfigs } from "./configs";
import type { ColorTheme } from "../../../../constants/colorPalette";

type Props = GeoLayerProps & {
  colorTheme: ColorTheme;
};

export function BaseView({ data, colorTheme, visible = true }: Props) {
  if (!data) return null;

  const configs = getBaseConfigs(colorTheme);

  return (
    <>
      {Object.entries(configs).map(([key, config]) => {
        return (
          <PolygonLayer
            key={key}
            prefixId={`units_base_${key}`}
            data={data}
            visible={visible}
            filter={config.filter}
            fillStyle={config.fillStyle}
            lineStyle={config.lineStyle}
          />
        );
      })}
    </>
  );
}
