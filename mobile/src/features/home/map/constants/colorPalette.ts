// 機能別ゾーン配色 + 基盤レイヤー配色 + UI配色を定義する。
export type RoomCategory =
  | "learning" // 学習
  | "laboratory" // 実験・研究
  | "creative" // 創作
  | "meeting" // 会議・集会
  | "staff" // 職員
  | "social" // 交流
  | "sanitary" // 衛生
  | "circulation"; // 移動・設備

export type RoomCategoryPalette = {
  fill: string;
  line: string;
  circleFill?: string;
  opacity: number;
};

export type ColorTheme = {
  id: "light" | "dark";
  background: string;
  buildings: RoomCategoryPalette;
  buildingFloor: RoomCategoryPalette;
  venue: RoomCategoryPalette;
  sections: RoomCategoryPalette;
  surface: RoomCategoryPalette;
  walls: { fill: string; line: string };
  atrium: { fill: string; line: string };
  rooms: Record<RoomCategory, RoomCategoryPalette>;
  label: {
    textColor: string;
    textHaloColor: string;
    textHaloWidth: number;
  };
  controls: {
    floorBg: string;
    floorSelectedBg: string;
    floorText: string;
    floorSelectedText: string;
  };
};

export const LIGHT_THEME: ColorTheme = {
  id: "light",
  background: "#F0F1F3",
  buildings: { fill: "#E8E8EC", line: "#D4D4D8", opacity: 0.8 },
  buildingFloor: { fill: "#EDE8DC", line: "#D5CFC0", opacity: 0.9 },
  venue: { fill: "#E3EBF7", line: "#B0C4DE", opacity: 1.0 },
  sections: { fill: "#F7F2EA", line: "#E0D8C8", opacity: 1.0 },
  surface: { fill: "#FBF8F2", line: "#E5DDD0", opacity: 1.0 },
  walls: { fill: "#B8B8BD", line: "rgba(0,0,0,0.18)" },
  atrium: { fill: "#D5D9C5", line: "rgba(0,0,0,0.15)" },
  rooms: {
    learning: {
      fill: "#BBDEFB",
      line: "#90CAF9",
      circleFill: "#42A5F5",
      opacity: 1.0,
    },
    laboratory: {
      fill: "#E1BEE7",
      line: "#CE93D8",
      circleFill: "#AB47BC",
      opacity: 1.0,
    },
    creative: {
      fill: "#FFE0B2",
      line: "#FFCC80",
      circleFill: "#FF9800",
      opacity: 1.0,
    },
    meeting: {
      fill: "#FFF9C4",
      line: "#FFF176",
      circleFill: "#FBC02D",
      opacity: 1.0,
    },
    staff: {
      fill: "#D7CCC8",
      line: "#BCAAA4",
      circleFill: "#8D6E63",
      opacity: 1.0,
    },
    social: {
      fill: "#B2DFDB",
      line: "#80CBC4",
      circleFill: "#4DB6AC",
      opacity: 1.0,
    },
    sanitary: {
      fill: "#F8BBD0",
      line: "#F48FB1",
      circleFill: "#EC407A",
      opacity: 1.0,
    },
    circulation: {
      fill: "#C8E6C9",
      line: "#A5D6A7",
      circleFill: "#66BB6A",
      opacity: 1.0,
    },
  },
  label: {
    textColor: "#1A1A2E",
    textHaloColor: "rgba(255,255,255,0.7)",
    textHaloWidth: 1.5,
  },
  controls: {
    floorBg: "#FFFFFF",
    floorSelectedBg: "rgba(0, 122, 255, 0.55)",
    floorText: "#3A3A3C",
    floorSelectedText: "#FFFFFF",
  },
};

export const DARK_THEME: ColorTheme = {
  id: "dark",
  background: "#1A1C1E",
  buildings: { fill: "#24262B", line: "#3A3C42", opacity: 0.8 },
  buildingFloor: { fill: "#2A2620", line: "#3D3830", opacity: 0.9 },
  venue: { fill: "#1E2430", line: "#2A3548", opacity: 1.0 },
  sections: { fill: "#262320", line: "#3D3830", opacity: 1.0 },
  surface: { fill: "#2C2824", line: "#4A443D", opacity: 1.0 },
  walls: { fill: "#4A4C52", line: "rgba(255,255,255,0.10)" },
  atrium: { fill: "#2E3028", line: "rgba(255,255,255,0.08)" },
  rooms: {
    learning: {
      fill: "#1A3A5C",
      line: "#2A5290",
      circleFill: "#2A5290",
      opacity: 1.0,
    },
    laboratory: {
      fill: "#2D1B4E",
      line: "#4A2C7A",
      circleFill: "#4A2C7A",
      opacity: 1.0,
    },
    creative: {
      fill: "#4A2800",
      line: "#7A4400",
      circleFill: "#7A4400",
      opacity: 1.0,
    },
    meeting: {
      fill: "#4A4200",
      line: "#7A6E00",
      circleFill: "#7A6E00",
      opacity: 1.0,
    },
    staff: {
      fill: "#3E2723",
      line: "#5D4037",
      circleFill: "#5D4037",
      opacity: 1.0,
    },
    social: {
      fill: "#004D40",
      line: "#00695C",
      circleFill: "#00695C",
      opacity: 1.0,
    },
    sanitary: {
      fill: "#4A1530",
      line: "#7A2048",
      circleFill: "#7A2048",
      opacity: 1.0,
    },
    circulation: {
      fill: "#1B3A1B",
      line: "#2E5A2E",
      circleFill: "#2E5A2E",
      opacity: 1.0,
    },
  },
  label: {
    textColor: "#E8E8EC",
    textHaloColor: "rgba(0,0,0,0.6)",
    textHaloWidth: 1.5,
  },
  controls: {
    floorBg: "#2C2C2E",
    floorSelectedBg: "rgba(10, 132, 255, 0.55)",
    floorText: "#C7C7CC",
    floorSelectedText: "#FFFFFF",
  },
};
