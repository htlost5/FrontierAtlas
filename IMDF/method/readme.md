# 建物外形のpolygon取得に関して

1. OpenStreetMapにて建物をサーチ
2. IDを取得
3. overpass-turboでクエリを実行
4. エクスポートでgeojsonを選択
5. 中にpolygonとその他の情報が記載されている

```query
[out:json][timeout:25];
way(177929686);
out body;
>;
out skel qt;
```
