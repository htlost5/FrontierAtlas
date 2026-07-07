// useDisplayLevel 用のカスタムHookを定義する。
import { useMemo } from "react";

export const DisplayMode = {
  BUILDING: "building",
  ENTRANCE: "entrance",
  DETAIL: "detail",
};

export type DisplayModeType = (typeof DisplayMode)[keyof typeof DisplayMode];

export function useDisplayLevel(zoom: number): DisplayModeType {
  const displayMode = useMemo(() => {
    // 建物ラベル表示
    if (zoom < 17.9) return DisplayMode.BUILDING;

    // 入口アイコン表示
    if (zoom < 19.4) return DisplayMode.ENTRANCE;

    // 詳細表示
    return DisplayMode.DETAIL;
  }, [zoom]);
  return displayMode;
}
