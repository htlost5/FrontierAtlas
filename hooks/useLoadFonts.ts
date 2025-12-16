import { useFonts } from "expo-font";

export function useLoadFonts() {
    return useFonts({
        Y1LunaChord: require('@/assets/fonts/Y1LunaChord.otf'),
    });
}