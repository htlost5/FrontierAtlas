---
id: s4jh7d6woge56tzk16lb39h
title: ts
desc: ''
updated: 1770022775609
created: 1769945917656
---

## pathに関して

### baseDir

baseDirは、expo-file-systemのPaths.documentとする

例: Paths.document/settings/config.json

### ファイルパス設定

#### マップ関連

主に "/imdf" におく

1. /manifests
   - /manifest/cacheManifest.json

2. /geojson
   - /geojson/interact
   - /geojson/studyhall
   - /geojson/venue
   - /geojson/address.geojson

3. /venue
   - /venue/venue.geojson

4. /interact
   - /interact/buildings/buildings.geojson
   - /interact/footprints/footprints.geojson

5. /studyhall
   - /studyhall/buildings/buildings.geojson
   - /studyhall/footprints/footprints.geojson
   - /studyhall/levels/floor1~5.geojson
   - /studyhall/sections/floor1~5.geojson
   - /studyhall/units/floor1~5.geojson, study_stairs.geojson