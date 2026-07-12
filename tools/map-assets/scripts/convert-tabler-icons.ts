#!/usr/bin/env npx tsx
/**
 * Tabler Icons SVG → 複合PNG 変換スクリプト
 *
 * 円形背景 + 中央アイコンの複合PNGをテーマ別に生成
 * 依存: npm install @tabler/icons sharp
 * 実行: npx tsx tools/map-assets/scripts/convert-tabler-icons.ts
 *
 * 出力先: mobile/assets/images/icons/MapView/map/categoryIcons/{category}-{theme}.png
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const TABLER_ICONS_DIR = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "node_modules",
  "@tabler",
  "icons",
  "icons",
  "outline",
);

const OUTPUT_DIR = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "mobile",
  "assets",
  "images",
  "icons",
  "MapView",
  "map",
  "categoryIcons",
);

/** カテゴリ → Tabler SVG ファイル名マッピング */
const TABLER_ICON_NAMES: Record<string, string> = {
  learning: "book",
  laboratory: "flask",
  creative: "palette",
  meeting: "presentation",
  staff: "building-bank",
  social: "coffee",
  sanitary: "droplet",
};

/** ライトテーマ カテゴリ別 circleFill（背景の円の塗り色） */
const LIGHT_CIRCLE_FILLS: Record<string, string> = {
  learning: "#42A5F5",
  laboratory: "#AB47BC",
  creative: "#FF9800",
  meeting: "#FBC02D",
  staff: "#8D6E63",
  social: "#4DB6AC",
  sanitary: "#EC407A",
  circulation: "#66BB6A",
};

/** ダークテーマ カテゴリ別 circleFill（背景の円の塗り色） */
const DARK_CIRCLE_FILLS: Record<string, string> = {
  learning: "#2A5290",
  laboratory: "#4A2C7A",
  creative: "#7A4400",
  meeting: "#7A6E00",
  staff: "#5D4037",
  social: "#00695C",
  sanitary: "#7A2048",
  circulation: "#2E5A2E",
};

interface ThemeDef {
  id: string;
  fills: Record<string, string>;
}

const THEMES: ThemeDef[] = [
  { id: "light", fills: LIGHT_CIRCLE_FILLS },
  { id: "dark", fills: DARK_CIRCLE_FILLS },
];

/** SVG の stroke 色を上書きする */
function setSvgStroke(svg: string, color: string): string {
  return svg.replace(/stroke="[^"]*"/g, `stroke="${color}"`);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`[convert-tabler-icons] Output: ${OUTPUT_DIR}`);

  for (const category of Object.keys(TABLER_ICON_NAMES)) {
    const svgFileName = `${TABLER_ICON_NAMES[category]}.svg`;
    const svgPath = path.join(TABLER_ICONS_DIR, svgFileName);

    if (!fs.existsSync(svgPath)) {
      console.warn(`[WARN] SVG not found: ${svgPath}, skipping ${category}`);
      continue;
    }

    const rawSvg = fs.readFileSync(svgPath, "utf-8");

    for (const theme of THEMES) {
      const fillColor = theme.fills[category];

      // 1. SVG stroke色を白に上書きし、48×48px でレンダリング
      const coloredSvg = setSvgStroke(rawSvg, "#FFFFFF");
      const iconBuffer = await sharp(Buffer.from(coloredSvg))
        .resize(56, 56)
        .trim() // ★ 白枠（透明余白）を完全除去
        .toBuffer();

      // 2. 円形コンテナ (96×96, 円 d=80) を作成
      const bgSvg = `<svg width="96" height="96"><circle cx="48" cy="48" r="40" fill="${fillColor}"/></svg>`;
      const bgBuffer = await sharp(Buffer.from(bgSvg)).png().toBuffer();

      // 3. 合成
      const outputName = `${category}-${theme.id}.png`;
      const outputPath = path.join(OUTPUT_DIR, outputName);
      await sharp(bgBuffer)
        .composite([{ input: iconBuffer, gravity: "center" }])
        .png()
        .toFile(outputPath);

      console.log(
        `[OK] ${outputName} (96×96, circleFill=${fillColor}, icon=#FFFFFF)`,
      );
    }
  }

  console.log("[convert-tabler-icons] Done!");
}

main().catch((err) => {
  console.error("[convert-tabler-icons] Fatal error:", err);
  process.exit(1);
});
