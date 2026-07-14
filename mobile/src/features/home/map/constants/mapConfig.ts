// マップ表示の初期設定とズーム・制限設定をまとめる。
const zoom = {
  max: 20.8,
  min: 17.3,
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
      ne: [139.679714, 35.499915],
      sw: [139.677075, 35.495558],
    },

    dynamicCenter: {
      enabled: true,
      animationDuration: 0,
      breakpoints: [
        { zoom: 17.3, narrowBy: 0 },
        { zoom: 20.8, narrowBy: 80 },
      ],
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
