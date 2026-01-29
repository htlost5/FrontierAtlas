---
id: ta0o9y69hl5l3m01m2z86ew
title: Cache_logic
desc: ""
updated: 1769695838895
created: 1769068935058
---

# cacheロジックに関して

## cache動作

### 全体のステップ

1. アプリ起動
2. .tmpファイルの検出＆削除
3. cacheManifestの存在有無確認
4. buildManifestとcacheManifestを比較 -> リスト化
5. 4の処理で確認した不足分に対してキャッシュ処理
6. 読み込んだデータをキャッシュに保存
7. 成功ごとに、cacheManifestを更新
8. 再度すべてbuildManifestとcacheManifestの一致確認
9. ロジック完全終了後、.tmpを検出し完全に削除する
10. 初期化完了を知らせる

※初期化処理は全体の処理で上限５として、ファイルが完全確認できるまで行う

### データ書き込みに関して

1. GeoJsonからデータセットを取得
2. json -> text形式に変換
3. expo-file-systemを利用して.tmpファイルに一度書き込み
4. .tmpへの書き込み完了後、これを本キャッシュフォルダへ移動（この際、他のファイルに対しての処理は行わせない）

### データ読み込みに関して

1. キャッシュディレクトリから指定のデータを取得
2. text -> json形式に変換

### キャッシュの存在確認に関して

1. manifest.jsonを読み、各ファイルのバージョン、サイズが一致するかを確認
2. 一致しないもの、manifestにあるのにキャッシュにないものをリスト化

データ構造

```
{
  "files": {
    "map1.json": {"version":"1.2.0","size":12345},
    "poi.json": {"version":"1.0.0","size":234}
  },
  "generatedAt": 1769068999
}
```

### manifest.jsonの生成

自動で、geojsonフォルダ内にあるファイルに対して、名前、version, sizeを取得し、manifestを生成するtsスクリプトを構築

必要な情報

- ファイル名
- version -> ファイルから取得
- サイズ -> geojsonファイルをテキスト変換し、サイズを取得

### 必要な実装

- geojsonへのバージョン登録導入
- manifest.jsonの自動生成スクリプト
- jsonパース関連で、text -> json / json -> text
- expo-file-system関連で、ファイルの読み込み、書き込み、存在確認
- アプリ起動時に走る存在確認&manifest一致・リスト化
- リストを受け取って、指定データをキャッシュに登録する
- データの読み込み/書き込み処理まとめ

### 実装手順

1. infra関連を構築
   - jsonパース処理
   - expo-file-systemの読み込み、書き込み、削除、存在確認 -> expo側のラップ
   - データの読み込み、書き込み、削除処理 -> .tmpから本フォルダへ、アトミック形式の採用

2. geojsonファイルへのバージョン構造導入
3. buildManifest.jsonの自動生成スクリプトを構築
4. 本ロジックの構築
   1. 初期化処理がimportするファイルの構築
   - .tmpの検出＆削除
   - cacheManifestの存在有無（すべてのファイルにexistを検証）
   - ない場合 -> リストにbuildManifestの全データ名を入れる
   - ある場合、buildManifest.jsonと比較、不足分をリスト化
   - 不足データのキャッシュ保存処理（この際にcacheManifestを更新）
   - 再度buildManifestとcacheManifestの一致確認
   - 完了後、.tmpの削除
   - 初期化完了を知らせる
   1. 補助ロジックファイル構築
   - buildManifest / cacheManifestの一致確認処理
   - リスト受け取り、キャッシュ保存処理
