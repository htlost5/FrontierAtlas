const zoom = {
  max: 21.1,
  min: 17.0,
  buffer: 0.2,
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
};
