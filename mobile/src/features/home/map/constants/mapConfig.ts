// マップ表示の初期設定とズーム・制限設定をまとめる。
const zoom = {
  max: 20.3,
  min: 17.35,
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
    // union of LOG bounds + ~1m buffer
    //   Union NE (raw): [139.68010757, 35.49975630]
    //   Union SW (raw): [139.67740003, 35.49582529]
    bounds: {
      ne: [139.680119, 35.499765],
      sw: [139.677389, 35.495816],
    },
  },

  displayThresholds: {
    building: 17.8,
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
