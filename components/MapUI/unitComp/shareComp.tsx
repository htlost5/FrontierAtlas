import { FillLayer, LineLayer } from "@maplibre/maplibre-react-native";
import { LayerConfig } from "./LayerConfig";

type Props = {
    floor_num: number;
    sourceId: string;
    config: LayerConfig;
}

export function PolygonLayer({ floor_num, sourceId, config }: Props){
    return (
        <>
            <FillLayer
                id={`${config.key}-fill-${floor_num}`}
                sourceID={sourceId}
                filter={config.filter}
                style={{
                    fillColor: config.fillColor,
                    visibility: "visible",
                }}
            />
            <LineLayer
                id={`${config.key}-line-${floor_num}`}
                sourceID={sourceId}
                filter={config.filter}
                style={{
                    lineColor: config.lineColor,
                    visibility: "visible",
                    lineWidth: 1.5,
                }}
            />
        </>
    )
}