// usePrepareApp 用のカスタムHookを定義する。
import { useLoadFonts } from "./baseSet/useLoadFonts";

export default function usePrepareApp() {
  const fontsLoaded = useLoadFonts();

  const baseReady = fontsLoaded;

  return baseReady;
}
