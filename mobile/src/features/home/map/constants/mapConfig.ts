// マップ表示の初期設定とズーム・制限設定をまとめる。
const zoom = {
  max: 20.8,
  min: 16.8,
  buffer: 0.1,
};

export const mapConfig = {
  default: {
    center: [139.6784895108818, 35.49777179199512],
    zoom: 17.5,
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

  displayThresholds: {
    building: 18.0,
    entrance: 19.5,
  },

  animation: {
    duration: {
      flyTo: 750,
      cameraInit: 800,
      zoomBound: 250,
    },
  },
};
