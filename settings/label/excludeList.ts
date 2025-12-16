export const exclude = {
  floor: {
    // アイコンなし
    POINT: [
      "stairs",
      "concrete",
      "lobby",
      "launge",
      "terrace",
      "opentobelow",
      "unclosedarea",
      "glass",
      "restroom.male",
      "restroom.female",
      "restroom.transgender.wheelchair",
      "elevator",
      "vending",
    ],
    // テキストなし
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
