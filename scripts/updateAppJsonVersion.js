const fs = require('fs');

const appJsonPath = './app.json';
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

const packageJson = require('./package.json');
const newVersion = packageJson.version;

// andoridのversionCode用に変換（整数型）
const newVersionParts = newVersion.split(".");
const newVersionCode = parseInt(newVersionParts[0]) * 100 + parseInt(newVersionParts[1]) * 10 + parseInt(newVersionParts[2])


// app.jsonのexpo.versionをpackage.jsonのversionに同期
if (appJson.expo) {
  appJson.expo.version = newVersion;
  appJson.expo.android.versionCode = newVersionCode

  // versionCodeやbuildNumberも更新したい場合は追加で処理
  // 例）Android versionCodeは整数なので、ここで設定可能（今回はパッチ更新で+1も可能）

  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
  console.log(`app.json のバージョンを ${newVersion} に更新しました`);
} else {
  console.error('app.json に "expo" フィールドが見つかりません');
  process.exit(1);
}
