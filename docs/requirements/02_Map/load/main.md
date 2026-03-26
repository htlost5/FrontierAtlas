## 概要

- データ更新、ファイルサイズに柔軟に対応した、マップロード機能の実装

## 目的

### 現状の問題

- マップ更新の際、アプリを更新、再配布する必要がある
- 読み込みの際に明らかな遅延がある
- ロードの仕組みが不明瞭
- イベントに対応できない

### 理想状態

- 問題点のクリア
  - 仕組みを明確にする
  - 再配布をしなくても更新できるようにする
  - ロード時の遅延をなくす -> 一括で表示されるように

## 実装手法

### 主に利用するもの

- reactnative: アプリ基盤
- github pages: マップアセットの配置
- supabase: イベント開催時の追加情報、付加
- github actions: 開発時のjson, イベント自動更新
- expo-file-system: 読み込んだファイルの保存先

## ①server側挙動

1. github pagesに次のデータを格納
   - 各地物ファイル（geojson形式、拡張子は.json）
   - manifest.json（manifest自体のバージョン、各地物ファイルのハッシュ・サイズ）

  <manifest.json>
  ``` 
  {
    "version": "2026-3-15",
    "files": {
      "{相対ID}": {
        "logicalId": "{相対ID}",
        "relativePath: "{相対パス}.json"
        "sha256": "{自動計算}",
        "size": "{自動計算}"
      }
    }
  }
  ```

   相対パス: デフォルトの親ディレクトリからの相対パス

   相対ID： 相対パスを "/" ではなく "_" にしたもの (拡張子省く)

  例：
  パス：imdf/interact/footprints/footprints.json

  相対パス: interact/footprints/footprints.json
  
  相対ID: interact_footprints_footprints

1. supabaseで追加情報の管理
   
   イベント時の "event_name", "time", "description"など
   
   イベント時にのみ運用（普段は利用しない）
   
   実装タイミングは、基本のgithub pagesとアプリ側でのロードのロジックの実装完了後

2. ライフサイクル -> github actionsで管理
   github pages: push 検知時に、manifest.jsonの自動生成と更新された地物データの格納 / ローカルで削除されたgeojsonは同様にgithub pages側も削除
   
   supabase: イベント準備期間に、地物データのIDと対応した、イベント時のみの特殊名称や、時間、説明などのデータベースを付加 -> 本体のマップアプリ側では検知しない

#### github actions実装
1. QGISでデータ作成
2. pyスクリプトでエクスポート
3. CIにわたす

CIの挙動:

1. exports/base | exports/buildから、.jsonのみのディレクトリ構築
2. release用のファイル作成、（data / zip）
3. gh-pagesブランチにプッシュ

データは、gh-pagesに保管


## ②アプリ側挙動

### 起動シーケンス

< loadAllGeojson() >

0. ローカルファイルcleanup
   - .tmpファイルの検知
   - 対応するエントリを探す
   - ある場合のみ -> status = "failed"に
   - ファイル削除

1. 初期検証
   - local-manifest.jsonがあるかを検証
   - なければ新規でlocal-manifest.json = {}を作成

2. remote manifest 取得
   - 試行: fetch remote-manifest.json (github pagesから)
   - 成功 -> mode = online, 失敗 -> mode = offline (asset/local-manifest.jsonを使用)

3. 差分検出
   - 比較ルール (remote or local)
     - remoteに存在 && localに存在
       - if !size/sha256 -> update
       - else -> skip
     - remoteに存在 && localになし -> add
     - localに存在 && remoteになし -> delete
   - 差分をupdatePlanに格納

4. 実行
   - updatePlanを実行 (先にadd / update -> delete)

5. 完了後
   - アプリレジストリにcompleteのアセットを渡す

オフラインかつmanifestがない場合 -> 全てあると仮定する
アプリレジストリへ登録の際、fsの読み込みに失敗したらないと判断してアセットから読み込んで保存

### status管理
- "pending": ローカルにキューとして登録済み
- "downloading": tmpにダウンロード中
- "downloaded": tmpにダウンロード完了（検証前）
- "verifying": size / sha256を検証中
- "installing": tmp -> 本体へ移動中
- "complete": 正式に local-manifest へ登録済


### ファイル単位の遷移

1. キューを登録
   - 基本情報とstatusの書き込み
  "{相対ID}": {
      "logicalId": "{相対ID}",
      "relativePath: "{相対パス}.json",
      "sha256": "",
      "size": "",
      "status": "pending"
  }
2. 


3. 対象を決定（パスの取得など）

4. manifestにエントリ作成
   "{相対ID}": {
      "logicalId": "{相対ID}",
      "relativePath: "{相対パス}.json",
      "sha256": "",
      "size": "",
      "status": "pending"
  }

1. status = "downloading" に更新

2. アセットからファイル取得

3. tmpファイルに書き込み

4. hash / size検証 (tmpに対して)

5. rename (tmp → 本ファイル)

6. hash / sizeを書き込み

7.  status = "complete" に更新

8.  すべての地物データをアプリ側のレジストリに渡す


オンラインの場合
1. github pagesからmanifest.jsonをfetch

2. local-manifest.jsonを作成

3. 対象を決定

4. manifestにエントリ作成
   "{相対ID}": {
      "logicalId": "{相対ID}",
      "relativePath: "{相対パス}.json",
      "sha256": "",
      "size": "",
      "status": "pending"
  }

5. status = "downloading"に更新

6. 地物データをgithub pagesからfetch

7. tmpファイルに書き込み

8. 地物ファイルのsizeの検証

9.  地物ファイルのsha256検証

10. hash / sizeを書き込み

11. status = "complete"に更新

12. すべての地物データをアプリ側のレジストリに渡す

※fetchを失敗した場合、アセットからロードしたものを配置


初回以降
オフラインの場合
1. アプリ側のレジストリに対して、必要な地物があるかを確認
2. ない場合は、expo-file-systemを確認しあればロード、ない場合は更にアセットからexpo-file-systemへ保存したうえで、ロード
3. すべてのロードが完了後マップのロードを終了する
※expo-file-systemへのデータ追加時は、manifest.jsonに上書き記録

オンラインの場合
1. github pagesのmanifest.jsonを取得する
2. ローカルのmanifest.jsonとgithub pagesのmanifest.jsonを比較し、次を実行
   - {size, SHA256}に相違がある場合 -> 差分として、削除＆ロード
   - github pages側にはあるのにローカルには存在しない場合 -> 新規でロード
   - github pages側にはないのにローカルに存在する場合 -> 削除する
  
  変更するファイル名は、updateListに格納
  
  ロード手順
   1. fetch -> tempとして保存
   2. tempのsha256がリモートのmanifest.jsonにあるsha256と一致するかを確認
   3. 確認完了後、実ファイルとして保存
   4. manifest.jsonに追記

   削除手順
   5. ローカルで対象のファイルが有るかを確認
   6. 削除する
   7. manifest.jsonに登録された情報を削除


   削除＆ロードの場合
   1. fetch -> tempとして保存
   2. tempのsha256を検証
   3. 旧ファイルを削除
   4. 正規ファイルとして保存
   5. アプリ側のupdateFiles.updateに追記

   新規でロードの場合
   6. ロード手順を実施
   7. アプリ側のuppdateFile.updateに追記

   削除のみの場合
   8. 削除手順を実施
   9.  アプリ側のupdateFiles.deleteに追記
   
3. アプリ側でupdateFiles.deleteに登録されたレジストリに保存されているファイルをすべて削除
4. 同様に、updateFiles.updateに登録されたレジストリに保存されているファイルを削除し、ロード

※manifest.jsonがないのにローカルにデータが存在する場合は、expo-file-systemに保存されているすべての地物データ情報をロードして新規でmanifest.jsonを作成する

？：hashを入れる場合、size情報は不要か？

expo-file-systemにない場合（初回起動時）
1. 

expo-file-systemにある場合
1. github pagesのmanifest.jsonをfetch
2. native_manifestとgithub_manifestを比較し、


5. expo-file-systemにファイルが存在するかを確認
   -> ない場合 -> ネットワークの接続を確認したうえでgithub pagesからすべてを取得
   -> ある場合 -> 2へ
6. バージョンとSHA256ハッシュを確認
7. 2で一致しなかったもの、ファイル自体が不足しているものをターゲットとする
8. ターゲットをgithub pagesからfetch
9.  fetch完了したものをreact-naitve-fsでローカルに保存
10. マップアプリ側でregistryの情報を確認し、ローカルに保存されたファイルとバージョン、ハッシュ、サイズが一致しないデータ、不足しているデータを、再度格納

フォールバック
1. オフラインの場合
- ローカルのデータが不完全または完全にない場合：「オンラインにしてください」を要求
- 十分にある場合：マップを表示、警告：オンラインでないと情報が古い場合があると出力


必要最低限のデータはアプリに格納しておくべきか？



具体的にサーバ側に何を配置するかを定義




## 目的

- マップの読み込みの手法を考える

## 必須事項

- 素早い読み込み
- 頻繁な更新に対応

## 理想動作

- 基本地物データをあらかじめ設定 -> geometry情報 + 基本プロパティ
- サーバにデータを配置
- イベント時には、その地物データに情報を付加
- アプリ起動時に、サーバのマップと比較し更新、不足を検知した場合再リロード

## 実装方法4

### データベース側

1. github pagesに全geojsonファイル及び、バージョンjsonファイルを配置
2. supabaseで、文化祭などのイベント時に必要な追加情報を設定
3. github actionsでこれらの更新を自動化

### アプリ側

1. 起動時に、ローカルに保存されているバージョンと、pagesのバージョンを比較
2. 差分検知し、更新の必要があれば再取得
3. 取得したgeojsonファイルは、ローカルに保存し、アプリ側でレジストリにキャッシュとして格納