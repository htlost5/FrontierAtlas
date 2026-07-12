#!/usr/bin/env npx tsx
/**
 * 特殊シンボルPNG生成スクリプト
 *
 * 角丸四角背景(#444444) + 白アイコン(#FFFFFF)の複合PNGを生成
 * 依存: npm install @tabler/icons sharp
 * 実行: npx tsx tools/map-assets/scripts/convert-special-symbols.ts
 *
 * 出力先: mobile/assets/images/icons/MapView/MapLogo/special/{name}.png
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
  "MapLogo",
  "special",
);

/** 特殊シンボル → Tabler SVG ファイル名マッピング */
const SPECIAL_SYMBOLS: Record<string, string> = {
  "special-toilet-male": "gender-male",
  "special-toilet-female": "gender-female",
  "special-toilet-accessible": "wheelchair",
  "special-elevator": "elevator",
  "special-vending": "shopping-bag",
  "special-locker": "lock",
  "special-emergency-exit": "door-exit",
};

/** SVG の stroke 色を上書きする */
function setSvgStroke(svg: string, color: string): string {
  return svg.replace(/stroke="[^"]*"/g, `stroke="${color}"`);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`[convert-special-symbols] Output: ${OUTPUT_DIR}`);

  for (const [outputName, tablerName] of Object.entries(SPECIAL_SYMBOLS)) {
    const svgFileName = `${tablerName}.svg`;
    const svgPath = path.join(TABLER_ICONS_DIR, svgFileName);

    if (!fs.existsSync(svgPath)) {
      console.warn(`[WARN] SVG not found: ${svgPath}, skipping ${outputName}`);
      continue;
    }

    const rawSvg = fs.readFileSync(svgPath, "utf-8");

    // 1. SVG stroke色を白に上書きし、64×64px でレンダリング
    const coloredSvg = setSvgStroke(rawSvg, "#FFFFFF");
    const iconBuffer = await sharp(Buffer.from(coloredSvg))
      .resize(72, 72)
      .trim() // ★ 白枠（透明余白）を完全除去
      .png()
      .toBuffer();

    // 2. 角丸四角コンテナ (112×112, rx=12, fill=#444444) を作成
    const bgSvg = `<svg width="112" height="112"><rect width="112" height="112" rx="12" fill="#444444"/></svg>`;
    const bgBuffer = await sharp(Buffer.from(bgSvg)).png().toBuffer();

    // 3. 合成
    const outputPath = path.join(OUTPUT_DIR, `${outputName}.png`);
    await sharp(bgBuffer)
      .composite([{ input: iconBuffer, gravity: "center" }])
      .png()
      .toFile(outputPath);

    console.log(`[OK] ${outputName}.png (112×112, fill=#444444, icon=#FFFFFF)`);
  }

  console.log("[convert-special-symbols] Done!");
}

main().catch((err) => {
  console.error("[convert-special-symbols] Fatal error:", err);
  process.exit(1);
});
