// マップの選択状態を管理するための定義を置くファイル。

export type SelectionState = {
  selectedFeatureId: string | null;
  selectedFeatureType: string | null;
};

export const DEFAULT_SELECTION_STATE: SelectionState = {
  selectedFeatureId: null,
  selectedFeatureType: null,
};
