---
id: jlb8a6tdcfnp7mo4x2dz395
title: GeojsonRegistry
desc: ''
updated: 1773534320092
created: 1770196251379
---

## geojsonRegistryに関して

### 目的

- loadGeoJson実行時のパースデータの保存先

### 持たせる役割

- registryという名のMap格納先
- 関数として、get(), set(), has(), delete(), clear()を持つ

#### get(id)

idからデータを取得し渡す

#### set(id)

idの名でデータを保存する

#### has(id)

idがあるかをbooleanで返す

#### delete(id)

idのデータを削除する

#### clean()

registry内の全データを削除する