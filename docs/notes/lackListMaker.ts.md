---
id: js72gfzjrbnykq4d6dvp75y
title: ts
desc: ''
updated: 1770022775605
created: 1769950492242
---

## 不足分リスト作成ロジック

### 構想

1. cacheManifestの有無確認
   -> ある場合: cacheManifestを渡す
   -> ない場合: allで送る

2. buildManifestからすべてのマップリストを取得（nameのみ）
   -> ない場合: これをリターン

-> ある場合
3. cacheManifestとbuildManifestの差分をリスト化