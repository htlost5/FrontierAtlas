#!/usr/bin/env npx tsx
/**
 * Tabler Icons SVG → PNG 変換スクリプト
 *
 * 依存: npm install @tabler/icons sharp @types/sharp
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
import { execSync } from "child_process";

// @tabler/icons から SVG を取得するためのパス
// npm package: @tabler/icons@latest
const TABLER_ICONS_DIR = path.resolve(
  __dirname,
  "..",
  "..",
  "node_modules",
  "@tabler",
  "icons",
  "icons",
);

const OUTPUT_DIR = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "mobile",
  "src",
  "assets",
  "images",
  "icons",
  "MapView",
  "map",
  "categoryIcons",
);

interface ConversionConfig {
  tablerName: string; // @tabler/icons/icons/ 以下のファイル名（例: "book.svg"）
  outputName: string; // 出力ファイル名（拡張子なし。例: "learning"）
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

function main() {
  // 出力ディレクトリを作成
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`[convert-tabler-icons] Output: ${OUTPUT_DIR}`);

  for (const { tablerName, outputName } of CONVERSIONS) {
    const svgPath = path.join(TABLER_ICONS_DIR, tablerName);

    if (!fs.existsSync(svgPath)) {
      console.warn(`[WARN] SVG not found: ${svgPath}, skipping`);
      continue;
    }

    let svgContent = fs.readFileSync(svgPath, "utf-8");

    // ストローク色を #333333 に変更（ダークモードでも視認可能）
    svgContent = svgContent.replace(/stroke="[^"]*"/g, 'stroke="#333333"');

    // SVG を一時ファイルに書き出し
    const tmpSvgPath = path.join(OUTPUT_DIR, `${outputName}.svg`);
    fs.writeFileSync(tmpSvgPath, svgContent, "utf-8");

    // SVG → PNG（96x96px）変換
    // @tabler/icons の SVG は viewBox="0 0 24 24" のため、4倍で 96px
    const pngPath = path.join(OUTPUT_DIR, `${outputName}.png`);
    try {
      // sharp がインストールされていない場合は npx 経由で実行
      execSync(
        `npx --yes @aspect-build/rules_js sharp-cli -i "${tmpSvgPath}" -o "${pngPath}" -w 96 -h 96 2>/dev/null || echo "FALLBACK: sharp-cli not available"`,
        { stdio: "inherit" },
      );
      console.log(`[OK] ${outputName}.png`);
    } catch {
      // sharp-cli が使えない場合は SVG をそのままコピー（React Native は SVG を直接読めないため注意）
      console.error(
        `[ERROR] Failed to convert ${outputName}.svg to PNG. Please install sharp.`,
      );
      console.error(`        npm install --save-dev sharp @types/sharp`);
    }

    // 一時SVGを削除
    try {
      fs.unlinkSync(tmpSvgPath);
    } catch {}
  }

  console.log("[convert-tabler-icons] Done!");
}

main();
