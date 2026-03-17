---
id: slcuhup2sgurkunyijo7pwa
title: ts
desc: ''
updated: 1770197833212
created: 1770197658326
---

## map読み込みロジックに関して

- useMapGeoDataで、path解決とデータ呼び出しを行う
- useFloorGeoDataでuseEffectで定義した、floor_numによって変わるデータを準備する
  
- それぞれで共通して利用するuseGeoDataByLogicalIdを定義する -> path解決＆読み込みの責務