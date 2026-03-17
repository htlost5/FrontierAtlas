const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function getConfig() {
  const cfg = vscode.workspace.getConfiguration('reqGenerator');
  return {
    baseDir: cfg.get('baseDir', 'docs/requirements'),
    defaultFiles: cfg.get('defaultFiles', ['main', 'config', 'paths', 'errors']),
  };
}

function getWorkspaceRoot() {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) throw new Error('ワークスペースが開かれていません');
  return folders[0].uri.fsPath;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nextPaddedNumber(dir) {
  if (!fs.existsSync(dir)) return '01';
  const entries = fs.readdirSync(dir).filter(f => /^\d+_/.test(f));
  return String(entries.length + 1).padStart(2, '0');
}

async function openFile(filePath) {
  const doc = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(doc);
}

// ── テンプレート ──────────────────────────────

function readmeTemplate(name) {
  return `# ${name}\n\n## メタ情報\n- ステータス: ドラフト\n- 担当者: @\n- 最終更新: ${today()}\n\n## 概要\n<!-- この機能の目的・背景を記述 -->\n\n## ファイル構成\n| ファイル | 内容 |\n|---|---|\n| main.md | 機能要件・業務フロー |\n| config.md | 設定値・定数・環境差異 |\n| paths.md | 画面URL・APIエンドポイント |\n| errors.md | エラーコード・ハンドリング方針 |\n\n## 関連リンク\n- Issue:\n- 設計書:\n- 依存機能:\n`;
}

function mainTemplate(name) {
  return `# ${name}：機能要件\n\n## メタ情報\n- ステータス: ドラフト\n- 更新日: ${today()}\n\n## ユーザーストーリー\n- As a [ユーザー], I want to [操作], so that [目的]\n\n## 機能要件\n- [ ] FR-001:\n- [ ] FR-002:\n\n## 非機能要件\n- パフォーマンス:\n- 可用性:\n\n## 業務フロー\n\`\`\`\n[開始] → [処理] → [終了]\n\`\`\`\n\n## 除外スコープ\n-\n\n## 変更履歴\n| バージョン | 日付 | 変更内容 |\n|---|---|---|\n| 1.0.0 | ${today()} | 初版 |\n`;
}

function configTemplate(name) {
  return `# ${name}：設定値・定数\n\n## メタ情報\n- 更新日: ${today()}\n\n## 環境別設定\n| キー | 開発 | ステージング | 本番 | 説明 |\n|---|---|---|---|---|\n|  |  |  |  |  |\n\n## 定数\n| 定数名 | 値 | 説明 |\n|---|---|---|\n|  |  |  |\n\n## フラグ\n| フラグ名 | デフォルト | 説明 |\n|---|---|---|\n|  |  |  |\n`;
}

function pathsTemplate(name) {
  return `# ${name}：パス定義\n\n## メタ情報\n- 更新日: ${today()}\n\n## 画面URL\n| パス | 画面名 | 備考 |\n|---|---|---|\n|  |  |  |\n\n## APIエンドポイント\n| メソッド | パス | 説明 | 認証 |\n|---|---|---|---|\n| GET |  |  |  |\n| POST |  |  |  |\n\n## リダイレクト\n| 条件 | リダイレクト先 |\n|---|---|\n|  |  |\n`;
}

function errorsTemplate(name) {
  return `# ${name}：エラー定義\n\n## メタ情報\n- 更新日: ${today()}\n\n## エラーコード一覧\n| コード | メッセージ | 原因 | ハンドリング方針 |\n|---|---|---|---|\n|  |  |  |  |\n\n## エラーフロー\n\`\`\`\nエラー発生 → ログ記録 → ユーザー通知 → リカバリ処理\n\`\`\`\n`;
}

function phaseReadmeTemplate(phaseName, featureName) {
  return `# ${featureName} / ${phaseName}\n\n## メタ情報\n- ステータス: ドラフト\n- 更新日: ${today()}\n\n## このフェーズの概要\n<!-- ${phaseName} フェーズの目的・処理概要 -->\n\n## 処理順序\n1. server-fetch.md   → サーバからデータ取得\n2. local-storage.md  → ローカル・レジストリ保存\n3. registry-usage.md → アプリからのデータ参照\n\n## 前提条件・依存\n-\n\n## 変更履歴\n| バージョン | 日付 | 変更内容 |\n|---|---|---|\n| 1.0.0 | ${today()} | 初版 |\n`;
}

const TEMPLATE_MAP = {
  README: readmeTemplate,
  main:   mainTemplate,
  config: configTemplate,
  paths:  pathsTemplate,
  errors: errorsTemplate,
};

function renderTemplate(key, featureName) {
  const fn = TEMPLATE_MAP[key];
  return fn ? fn(featureName) : `# ${featureName}：${key}\n\n- 更新日: ${today()}\n\n## 概要\n\n## 詳細\n`;
}

// ── コマンド1：ルート機能フォルダを生成 ──────

async function cmdNewFeature() {
  const { baseDir, defaultFiles } = getConfig();
  const featureName = await vscode.window.showInputBox({
    prompt: '機能名を入力（英小文字・ハイフン区切り）',
    placeHolder: 'map',
    validateInput: v => /^[a-z0-9-]+$/.test(v) ? null : '英小文字・数字・ハイフンのみ使用可',
  });
  if (!featureName) return;

  const root = getWorkspaceRoot();
  const reqBase = path.join(root, baseDir);
  const num = nextPaddedNumber(reqBase);
  const featureDir = path.join(reqBase, `${num}_${featureName}`);

  if (fs.existsSync(featureDir)) {
    vscode.window.showErrorMessage(`既に存在します: ${num}_${featureName}`);
    return;
  }

  fs.mkdirSync(path.join(featureDir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(featureDir, 'README.md'), renderTemplate('README', featureName));
  for (const file of defaultFiles) {
    fs.writeFileSync(path.join(featureDir, `${file}.md`), renderTemplate(file, featureName));
  }

  await openFile(path.join(featureDir, 'README.md'));
  vscode.window.showInformationMessage(`✅ 生成完了: ${num}_${featureName}/`);
}

// ── コマンド2：サブ機能フォルダを生成 ─────────

async function cmdNewSubFeature(uri) {
  const { defaultFiles } = getConfig();
  let parentDir;

  if (uri && uri.fsPath) {
    parentDir = uri.fsPath;
  } else {
    const root = getWorkspaceRoot();
    const { baseDir } = getConfig();
    const reqBase = path.join(root, baseDir);

    if (!fs.existsSync(reqBase)) {
      vscode.window.showErrorMessage(`ベースディレクトリが存在しません: ${baseDir}`);
      return;
    }

    const features = fs.readdirSync(reqBase)
      .filter(f => fs.statSync(path.join(reqBase, f)).isDirectory());

    if (features.length === 0) {
      vscode.window.showErrorMessage('ルート機能フォルダがまだ存在しません。先にコマンド1を実行してください。');
      return;
    }

    const selected = await vscode.window.showQuickPick(features, {
      placeHolder: 'サブフォルダを追加する機能フォルダを選択',
    });
    if (!selected) return;
    parentDir = path.join(reqBase, selected);
  }

  const subName = await vscode.window.showInputBox({
    prompt: 'サブ機能名を入力（例：load / render / search）',
    placeHolder: 'load',
    validateInput: v => /^[a-z0-9-]+$/.test(v) ? null : '英小文字・数字・ハイフンのみ使用可',
  });
  if (!subName) return;

  const subDir = path.join(parentDir, subName);
  if (fs.existsSync(subDir)) {
    vscode.window.showErrorMessage(`既に存在します: ${subName}/`);
    return;
  }

  const featureName = path.basename(parentDir).replace(/^\d+_/, '');
  fs.mkdirSync(path.join(subDir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(subDir, 'README.md'), phaseReadmeTemplate(subName, featureName));
  for (const file of defaultFiles) {
    fs.writeFileSync(path.join(subDir, `${file}.md`), renderTemplate(file, `${featureName}/${subName}`));
  }

  await openFile(path.join(subDir, 'README.md'));
  vscode.window.showInformationMessage(`✅ サブフォルダ生成完了: ${featureName}/${subName}/`);
}

// ── コマンド3：フェーズファイルを個別生成 ─────

async function cmdNewPhaseFiles(uri) {
  if (!uri || !uri.fsPath) {
    vscode.window.showErrorMessage('エクスプローラーのフォルダを右クリックして実行してください');
    return;
  }

  const targetDir = uri.fsPath;
  const featureName = path.basename(targetDir);

  const PHASE_OPTIONS = [
    { label: 'server-fetch',    description: 'サーバ通信でのデータ取得' },
    { label: 'local-storage',   description: 'ローカル保存・レジストリ書き込み' },
    { label: 'registry-usage',  description: 'レジストリからのデータ利用' },
    { label: 'error-handling',  description: 'エラーハンドリング' },
    { label: '(カスタム入力)',  description: '任意のファイル名を入力する' },
  ];

  const selected = await vscode.window.showQuickPick(PHASE_OPTIONS, {
    placeHolder: '生成するフェーズファイルを選択（複数可）',
    canPickMany: true,
  });
  if (!selected || selected.length === 0) return;

  let count = 0;
  for (const item of selected) {
    let fileName = item.label;

    if (fileName === '(カスタム入力)') {
      const custom = await vscode.window.showInputBox({
        prompt: 'ファイル名を入力（.md は自動付与）',
        placeHolder: 'my-phase',
        validateInput: v => /^[a-z0-9-]+$/.test(v) ? null : '英小文字・数字・ハイフンのみ使用可',
      });
      if (!custom) continue;
      fileName = custom;
    }

    const filePath = path.join(targetDir, `${fileName}.md`);
    if (fs.existsSync(filePath)) {
      vscode.window.showWarningMessage(`スキップ（既存）: ${fileName}.md`);
      continue;
    }

    const content = `# ${featureName}：${fileName}\n\n## メタ情報\n- ステータス: ドラフト\n- 更新日: ${today()}\n\n## 概要\n\n## 詳細要件\n- [ ] \n\n## 変更履歴\n| バージョン | 日付 | 変更内容 |\n|---|---|---|\n| 1.0.0 | ${today()} | 初版 |\n`;
    fs.writeFileSync(filePath, content);
    count++;
  }

  if (count > 0) {
    vscode.window.showInformationMessage(`✅ フェーズファイル ${count} 件生成完了`);
  }
}

// ── activate / deactivate ─────────────────────

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('req.newFeature',    cmdNewFeature),
    vscode.commands.registerCommand('req.newSubFeature', cmdNewSubFeature),
    vscode.commands.registerCommand('req.newPhaseFiles', cmdNewPhaseFiles),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
