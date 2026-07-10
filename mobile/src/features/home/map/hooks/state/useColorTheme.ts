// MapContext からカラーテーマを取得するカスタムフック。
// Context が利用できない場合（起動時など）は OS のカラースキームにフォールバックする。
import { useColorScheme } from "react-native";
import { useMapContext } from "./useMapContext";
import { LIGHT_THEME, DARK_THEME } from "../../constants/colorPalette";
import type { ColorTheme } from "../../constants/colorPalette";

export function useColorTheme(): ColorTheme {
  const ctx = useMapContext();
  const scheme = useColorScheme();
  if (!ctx) {
    return scheme === "dark" ? DARK_THEME : LIGHT_THEME;
  }
  return ctx.colorTheme ?? LIGHT_THEME;
}
