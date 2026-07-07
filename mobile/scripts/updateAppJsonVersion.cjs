/**
 * standard-version の post-bump フックとして使用するスクリプト
 * package.json の version を app.config.ts に反映する
 *
 * 使用方法:
 *   node scripts/updateAppJsonVersion.js
 * または .versionrc で指定:
 *   "scripts": { "postbump": "node scripts/updateAppJsonVersion.js" }
 */

const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
);
const newVersion = packageJson.version;

const appConfigPath = path.join(__dirname, '..', 'app.config.ts');
let appConfigContent = fs.readFileSync(appConfigPath, 'utf-8');

// config.version のフォールバック値 "1.0.0" を新しいバージョンに置き換え
// 実際には app.config.ts は動的に config.version を参照するため、
// この変更は静的フォールバック値の更新のみを目的とする
appConfigContent = appConfigContent.replace(
  /version:\s*config\.version\s*\|\|\s*"[^"]*"/,
  `version: config.version || "${newVersion}"`
);

fs.writeFileSync(appConfigPath, appConfigContent, 'utf-8');
console.log(`Updated app.config.ts fallback version to ${newVersion}`);
