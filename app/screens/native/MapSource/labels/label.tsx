import {
  ShapeSource,
  SymbolLayer,
  Images,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { exclude } from "./excludeList";
import UnitSymbol from "./iconSources/unit/unit-label";

type IconType = "none" | "floor";

type Props = {
  featureType: IconType;
  floor_num: number;
  data: FeatureCollection | null;
  display: boolean;
};

export default function LabelView({
  featureType,
  floor_num,
  data,
  display,
}: Props) {
  if (!data) return null;

  //   display_point→geometryへ設定
  const processedFeatures = data.features.map((f) => ({
    ...f,
    geometry: f.properties?.display_point,
  }));

  const processedGeoJson = {
    ...data,
    features: processedFeatures,
  };

  const isVisible = display;

  const renderLayers = () => {
    switch (featureType) {
      case "floor":
        return (
          <UnitSymbol pointData={processedGeoJson} isVisible={isVisible} />
        );
      case "none":
        return null;

      default:
        return null;
    }
  };

  return (
    <>
      <Images
        id="map-symbols"
        images={{
          pin: require("@/assets/images/icons/map/Pin.png"),
        }}
      />
      <ShapeSource id={`lavel-source-${floor_num}`} shape={processedGeoJson}>
        <SymbolLayer
          id="pin"
          filter={["!in", "category", ...exclude.floor.POINT] as any}
          style={{
            symbolPlacement: "point",
            iconImage: "pin",
            iconSize: 0.1,
            iconRotationAlignment: "viewport",
            visibility: isVisible ? "visible" : "none",
            iconAllowOverlap: true,
            textIgnorePlacement: true,
          }}
        />
        <SymbolLayer
          id="unit-symbol-text-point"
          filter={
            [
              "all",
              ["!in", "category", ...exclude.floor.TEXT],
              ["!in", "category", ...exclude.floor.POINT],
            ] as any
          }
          style={{
            symbolPlacement: "point",
            textField: ["get", "ja", ["get", "name"]],
            textSize: ["interpolate", ["linear"], ["zoom"], 17.9, 3, 21.1, 25],
            textFont: ["Noto Sans Regular"],
            visibility: isVisible ? "visible" : "none",
            textAllowOverlap: true,
            iconAllowOverlap: true,
            textIgnorePlacement: true,
            textAnchor: "left",
            textOffset: [1, 0],
          }}
        />
        <SymbolLayer
          id="unit-symbol-text"
          filter={
            [
              "all",
              ["!in", "category", ...exclude.floor.TEXT],
              ["in", "category", ...exclude.floor.POINT],
            ] as any
          }
          style={{
            symbolPlacement: "point",
            textField: ["get", "ja", ["get", "name"]],
            textSize: ["interpolate", ["linear"], ["zoom"], 17.9, 3, 21.1, 25],
            textFont: ["Noto Sans Regular"],
            visibility: isVisible ? "visible" : "none",
            textAllowOverlap: true,
            iconAllowOverlap: true,
            textIgnorePlacement: true,
          }}
        />
      </ShapeSource>
      <ShapeSource id={`${featureType}-symbol`} shape={processedGeoJson}>
        {renderLayers()}
      </ShapeSource>
    </>
  );
}
