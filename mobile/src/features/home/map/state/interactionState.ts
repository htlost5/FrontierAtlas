// マップの操作状態を管理するための定義を置くファイル。

export type InteractionState = {
  isPanning: boolean;
  isZooming: boolean;
};

export const DEFAULT_INTERACTION_STATE: InteractionState = {
  isPanning: false,
  isZooming: false,
};
