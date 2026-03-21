// カスタムフォント読み込みフック: Y1LunaChordフォントをアプリ全体で使用可能にする
/**
 * useFonts ラッパーフック
 * - Y1LunaChord フォントをアセットから読み込む
 * - フォント読み込み完了状態を bool で返す
 * @returns フォント読み込み完了フラグ（true: 完了, false: 読み込み中）
 */
import { useFonts } from "expo-font";
/**
 * Y1LunaChord フォントを読み込むカスタムフック
 * @returns フォント読み込み完了フラグ
 */
export function useLoadFonts(): boolean {
  const [loaded] = useFonts({
    Y1LunaChord: require("@/assets/fonts/Y1LunaChord.otf"),
  });

  return loaded;
}
