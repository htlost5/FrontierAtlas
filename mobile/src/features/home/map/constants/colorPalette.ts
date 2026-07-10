// 機能別ゾーン配色 + 基盤レイヤー配色 + UI配色を定義する。
export type ZoneType =
  | "classroom" // 講義・学習
  | "specialized" // 専門教室
  | "administration" // 管理・職員
  | "common" // 共用・交流
  | "sanitary" // 衛生・更衣
  | "other"; // 設備・その他

export type ZonePalette = {
  fill: string;
  line: string;
  opacity: number;
};

export type ColorTheme = {
  id: "light" | "dark";
  background: string;
  buildings: ZonePalette;
  venue: ZonePalette;
  sections: ZonePalette;
  walls: { fill: string; line: string };
  atrium: { fill: string; line: string };
  zones: Record<ZoneType, ZonePalette>;
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
  venue: { fill: "#E3EBF7", line: "#B0C4DE", opacity: 1.0 },
  sections: { fill: "#F7F2EA", line: "#E0D8C8", opacity: 1.0 },
  walls: { fill: "#B8B8BD", line: "rgba(0,0,0,0.18)" },
  atrium: { fill: "#D5D9C5", line: "rgba(0,0,0,0.15)" },
  zones: {
    classroom: { fill: "#C8DFC5", line: "#A3BFA0", opacity: 1.0 },
    specialized: { fill: "#C5D1E8", line: "#A0AECB", opacity: 1.0 },
    administration: { fill: "#DDD6D0", line: "#BFB8B2", opacity: 1.0 },
    common: { fill: "#F2DCC2", line: "#D9C4A8", opacity: 1.0 },
    sanitary: { fill: "#C5D5DF", line: "#A7BAC7", opacity: 1.0 },
    other: { fill: "#D8D8DC", line: "#B8B8BE", opacity: 1.0 },
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
  venue: { fill: "#1E2430", line: "#2A3548", opacity: 1.0 },
  sections: { fill: "#262320", line: "#3D3830", opacity: 1.0 },
  walls: { fill: "#4A4C52", line: "rgba(255,255,255,0.10)" },
  atrium: { fill: "#2E3028", line: "rgba(255,255,255,0.08)" },
  zones: {
    classroom: { fill: "#2A3A28", line: "#3E543B", opacity: 1.0 },
    specialized: { fill: "#262D3D", line: "#384158", opacity: 1.0 },
    administration: { fill: "#322E2B", line: "#48433D", opacity: 1.0 },
    common: { fill: "#362E24", line: "#4E4234", opacity: 1.0 },
    sanitary: { fill: "#242C33", line: "#36414A", opacity: 1.0 },
    other: { fill: "#2B2C30", line: "#404248", opacity: 1.0 },
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
