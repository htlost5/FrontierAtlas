import { useMemo } from "react";

export function useDisplayLevel(zoom: number) {
  const display = useMemo(() => {
    if (zoom < 17.9) return 0 as const;
    if (zoom < 19.4) return 1 as const;
    return 2 as const;
  }, [zoom]);
  return display;
}
