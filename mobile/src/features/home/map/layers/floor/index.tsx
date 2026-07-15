// フロアレイヤーの描画コンポーネントを定義する。
import { FloorProps } from "./types";
import { UnitView } from "./unit";
import { SurfaceLayer } from "./surface";

export function FloorView({
  floorData,
  colorTheme,
  visible = true,
}: FloorProps) {
  if (!floorData) return null;

  return (
    <>
      {/* 3F surface underlay (4F/5F only) */}
      {floorData.underlaySurface && (
        <SurfaceLayer
          data={floorData.underlaySurface}
          palette={{ ...colorTheme.surface, opacity: 0.5 }}
          visible={visible}
        />
      )}
      {/* Current floor surface */}
      <SurfaceLayer
        data={floorData.surface}
        palette={colorTheme.surface}
        visible={visible}
      />
      {/* Rooms */}
      <UnitView
        data={floorData.units}
        colorTheme={colorTheme}
        visible={visible}
      />
    </>
  );
}
