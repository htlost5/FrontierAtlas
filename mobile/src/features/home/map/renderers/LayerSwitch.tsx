// レイヤ表示切替のレンダリング補助を提供する。
import React from "react";

type Props = {
  visible: boolean;
  children: React.ReactNode;
};

export function LayerSwitch({ visible, children }: Props) {
  if (!visible) return null;
  return <>{children}</>;
}
