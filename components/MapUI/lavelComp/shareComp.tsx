import { SymbolLayer } from "@maplibre/maplibre-react-native";
import { LavelConfig } from "./LavelConfig";

type Props = {
  floor_num: number;
  sourceId: string;
  config: LavelConfig;
};

export default function LavelLayer({ floor_num, sourceId, config }: Props) {
  return (
    <>
      <SymbolLayer
        id={`${config.key}-symbol-${floor_num}`}
        sourceID={sourceId}
        filter={config.filter}
        style={{
          symbolPlacement: "point",
          iconImage: config.iconVisible ? config.key : "",
          iconSize: [
            "interpolate",
            ["linear"],
            ["zoom"],
            17,
            0.35,
            19,
            0.45,
            21,
            0.55,
          ],
          iconRotationAlignment: "viewport",
          iconAllowOverlap: false,

          textField: config.textVisible ? ["get", "ja", ["get", "name"]] : "",
          textSize: [
            "interpolate",
            ["linear"],
            ["zoom"],
            17,
            10,
            19,
            12,
            21,
            14,
          ],
          textFont: ["Noto Sans Regular"],
          textColor: config.textColor,
          textAnchor: config.iconVisible ? "left" : "center",
          textOffset: config.iconVisible ? [1.4, 0] : [0, 0],
          textAllowOverlap: false,
          textIgnorePlacement: false,
        }}
      />
    </>
  );
}
