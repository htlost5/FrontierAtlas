#!/usr/bin/env npx tsx
/**
 * Tabler Icons SVG → PNG 変換スクリプト
 *
 * 依存: npm install @tabler/icons sharp
 * 実行: npx tsx tools/map-assets/scripts/convert-tabler-icons.ts
 *
 * 出力先: mobile/src/assets/images/icons/MapView/map/categoryIcons/
 *
 * 仕様:
 * - 24x24px → 出力 96x96px（@4x Retina 対応）
 * - ストローク: 2px（Tabler Icons デフォルト）
 * - 色: #333333（ダークモードでも視認可能な中間色）
 * - 形式: PNG（アルファチャネル付き）
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const TABLER_ICONS_DIR = path.resolve(
  __dirname, "..", "..", "..", "node_modules", "@tabler", "icons", "icons", "outline",
);

const OUTPUT_DIR = path.resolve(
  __dirname, "..", "..", "..", "mobile", "src", "assets",
  "images", "icons", "MapView", "map", "categoryIcons",
);

interface ConversionConfig {
  tablerName: string;
  outputName: string;
}

const CONVERSIONS: ConversionConfig[] = [
  { tablerName: "book.svg", outputName: "learning" },
  { tablerName: "flask.svg", outputName: "laboratory" },
  { tablerName: "palette.svg", outputName: "creative" },
  { tablerName: "presentation.svg", outputName: "meeting" },
  { tablerName: "building-bank.svg", outputName: "staff" },
  { tablerName: "coffee.svg", outputName: "social" },
  { tablerName: "droplet.svg", outputName: "sanitary" },
  { tablerName: "arrows-move.svg", outputName: "circulation" },
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`[convert-tabler-icons] Output: ${OUTPUT_DIR}`);

  for (const { tablerName, outputName } of CONVERSIONS) {
    const svgPath = path.join(TABLER_ICONS_DIR, tablerName);

    if (!fs.existsSync(svgPath)) {
      console.warn(`[WARN] SVG not found: ${svgPath}, skipping`);
      continue;
    }

    const svgContent = fs.readFileSync(svgPath, "utf-8");

    const pngPath = path.join(OUTPUT_DIR, `${outputName}.png`);
    try {
      await sharp(Buffer.from(svgContent))
        .resize(96, 96)
        .png()
        .toFile(pngPath);
      console.log(`[OK] ${outputName}.png (96x96)`);
    } catch (err) {
      console.error(`[ERROR] Failed to convert ${tablerName}:`, err);
    }
  }

  console.log("[convert-tabler-icons] Done!");
}

main().catch((err) => {
  console.error("[convert-tabler-icons] Fatal error:", err);
  process.exit(1);
});
