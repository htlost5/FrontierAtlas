// マップのエラー状態を管理するための定義を置くファイル。

export type MapErrorState = {
  type: "data" | "render" | "network";
  message: string;
  timestamp: number;
} | null;

export function createMapError(
  type: NonNullable<MapErrorState>["type"],
  message: string,
): NonNullable<MapErrorState> {
  return {
    type,
    message,
    timestamp: Date.now(),
  };
}
