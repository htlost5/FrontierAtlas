const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 入力受付
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('どの階のデータを生成しますか？（1〜5 の数字を入力）> ', (answer) => {
  const floor = parseInt(answer, 10);

  if (isNaN(floor) || floor < 1 || floor > 5) {
    console.error('❌ 無効な入力です。1〜5 の数字を入力してください。');
    rl.close();
    return;
  }

  // パス設定
  const targetDir = `./assets/images/map/${floor}F`;
  const outputFile = `./app/screens/Map/Floors/Floor${floor}.tsx`;

  function formatName(fileName) {
    const nameWithoutExt = fileName.replace(/\.svg$/i, '');
    return nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);
  }

  const files = fs.readdirSync(targetDir).filter(file =>
    fs.statSync(path.join(targetDir, file)).isFile()
  );

  const svgFiles = files.filter(f => f.toLowerCase().endsWith('.svg'));

  const importStatements = svgFiles.map(f => {
    const varName = formatName(f);
    const relPath = path.relative(path.dirname(outputFile), path.join(targetDir, f)).replace(/\\/g, '/');
    return `import ${varName} from '${relPath}';`;
  }).join('\n');

  const fileContent = `// AUTO-GENERATED IMPORTS for ${floor}F - DO NOT EDIT
${importStatements}
`;

  fs.writeFileSync(outputFile, fileContent, 'utf8');
  console.log(`✅ ${outputFile} を生成しました！（import文のみ）`);

  rl.close();
});
