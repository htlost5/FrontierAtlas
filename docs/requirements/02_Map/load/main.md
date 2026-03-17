## what??

- データ更新、ファイルサイズに柔軟に対応した、マップロード機能の実装

## why??

### 現状の問題


- マップ更新の際、アプリを更新、再配布する必要がある
- 読み込みの際に明らかな遅延がある
- ロードの仕組みが不明瞭
- イベントに対応できない

### 目的

- 問題点のクリア
  - 仕組みを明確にする
  - 再配布をしなくても更新できるようにする
  - ロード時の遅延をなくす -> 一括で表示されるように

## How??

### 主に利用するもの

- reactnative: アプリ基盤
- github pages: マップアセットの配置
- supabase: イベント開催時の追加情報、付加
- github actions: 開発時のjson, イベント自動更新
- react-native-fs: 読み込んだファイルの保存先

### 仕組み

server
1. github pagesに次のデータを格納
   - 各地物ファイル（geojson形式、拡張子は.json）
   - manifest.json（manifest自体のバージョン、各地物ファイルのハッシュ・サイズ）

  <!-- manifest.json -->
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

  相対パス: デフォルトの親ディレクトリからの相対パス
  相対ID： 相対パスを "/" ではなく "_" にしたもの (拡張子省く)

  例：
  パス：imdf/interact/footprints/footprints.json
  相対パス: interact/footprints/footprints.json
  相対ID: interact_footprints_footprints

2. supabaseで追加情報の管理
   イベント時の "event_name", "time", "description"など
   イベント時にのみ運用（普段は利用しない）
   実装タイミングは、基本のgithub pagesとアプリ側でのロードのロジックの実装完了後

3. ライフサイクル -> github actionsで管理
   github pages: push 検知時に、manifest.jsonの自動生成と更新された地物データの格納 / ローカルで削除されたgeojsonは同様にgithub pages側も削除
   supabase: イベント準備期間に、地物データのIDと対応した、イベント時のみの特殊名称や、時間、説明などのデータベースを付加 -> 本体のマップアプリ側では検知しない

local

初回起動時
0. あらかじめ初版のアセットを配置しておく

オフラインの場合
1. アセットからファイル取得、react-native-fsに保存
2. 保存完了後、manifest.jsonに情報を追加
3. これを繰り返す
4. データロード完了後react-native-fsに保存されたすべての地物データをアプリ側のレジストリに渡す

オンラインの場合
1. github pagesからmanifest.jsonをfetch
2. 地物データをgithub pagesからfetch
3. 一時パスに保存
4. 地物ファイルのSHA256の検証、一致したら、正規パスへ
6. 最後にlocal側のmanifest.jsonへ記録


初回以降
オフラインの場合：ファイルが十分にあることを検証
1. react-native-fsのmanifest.jsonを取得
2. manifest.jsonのファイルが十分にあるかを確認

react-native-fsにない場合（初回起動時）
1. 

react-native-fsにある場合
1. github pagesのmanifest.jsonをfetch
2. native_manifestとgithub_manifestを比較し、


5. react-native-fsにファイルが存在するかを確認
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