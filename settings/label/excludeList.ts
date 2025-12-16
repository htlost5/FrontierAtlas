export const exclude = {
  floor: {
    POINT: [
      "stairs",
      "concrete",
      "lobby",
      "opentobelow",
      "restroom.male",
      "restroom.female",
      "restroom.transgender.wheelchair",
      "elevator",
      "vending",
    ],
    TEXT: [
      "stairs",
      "concrete",
      "opentobelow",
      "restroom.male",
      "restroom.female",
      "restroom.transgender.wheelchair",
      "elevator",
      "vending",
    ],
  },
  venue: {},
} as const;
