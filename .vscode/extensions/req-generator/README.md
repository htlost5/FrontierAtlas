# req-generator — 要件定義書ジェネレーター

プロジェクトの要件定義書フォルダ・ファイルをコマンド一発で生成するVS Code拡張機能。

## コマンド一覧

| コマンド | ショートカット | 説明 |
|---|---|---|
| `Req: ルート機能フォルダを生成` | Ctrl+Shift+R | `01_map/` のような番号付きフォルダを生成 |
| `Req: サブ機能フォルダを生成` | Ctrl+Shift+Alt+R | `map/load/` のようなサブフォルダを生成 |
| `Req: フェーズファイルのみ生成` | 右クリックメニュー | `server-fetch.md` など個別ファイルを生成 |

## 設定

`settings.json` でカスタマイズ可能：

```json
{
  "reqGenerator.baseDir": "docs/requirements",
  "reqGenerator.defaultFiles": ["main", "config", "paths", "errors"]
}
```

## インストール手順

1. このフォルダをプロジェクトの `.vscode/extensions/req-generator/` にコピー
2. VS Code を再起動
3. `Ctrl+Shift+P` → `Req:` で利用開始
