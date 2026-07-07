// マップ表示の初期設定とズーム・制限設定をまとめる。
const zoom = {
  max: 20.4,
  min: 17.1,
  buffer: 0.1,
};

export const mapConfig = {
  default: {
    center: [139.6784895108818, 35.49777179199512],
    zoom: 17.2,
    floor: 1,
  },

  zoom: {
    ...zoom,
    softMax: zoom.max - zoom.buffer,
    softMin: zoom.min + zoom.buffer,
  },

  restrict: {
    bounds: {
      ne: [139.67927425082215, 35.499188538841245],
      sw: [139.67751547790088, 35.49628365306419],
    },
  },
};
