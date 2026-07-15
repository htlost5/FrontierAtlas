# Changelog

All notable changes to FrontierAtlas will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

### [0.17.1](https://github.com/htlost/frontieratlas/compare/v0.17.0...v0.17.1) (2026-07-15)


### Features

* **map:** add visibleBounds logging alongside zoom level ([8b2aadf](https://github.com/htlost/frontieratlas/commit/8b2aadfec6e3641080b8eb2de00458285a267b79))
* **mobile:** add floor-specific surface layers to studyhall MapLibre rendering ([01cd7cf](https://github.com/htlost/frontieratlas/commit/01cd7cf947c3340330919d25dd5afbbd976c3965))
* **mobile:** expand map restrict.bounds by 1.5x ([ecffa89](https://github.com/htlost/frontieratlas/commit/ecffa895aab35a1d77008eed62d3564cd5115d23))

## [0.17.0](https://github.com/htlost/frontieratlas/compare/v0.16.3...v0.17.0) (2026-07-14)


### ⚠ BREAKING CHANGES

* **map:** Rename `inset` to `narrowBy` in `dynamicCenter.breakpoints`.
`narrowBy` narrows maxBounds edges inward by meters, making `narrowBy=0`
equivalent to maxBounds (previously `inset=0` collapsed to a point).

- Replace insetToBounds() with narrowByToBounds() using maxBounds edges
- Lerp narrowBy values directly instead of coordinates
- Add edge case guards: clamp + warn when narrowBy exceeds half-bounds
- Handle single breakpoint gracefully (previously required >= 2)

Refs: DD-compass-002_bounds-breakpoints
* **map:** ZoneType(6) → RoomCategory(8)
- カテゴリ再編: learning/laboratory/creative/meeting/staff/social/sanitary/circulation
- アイコン統一: 24個の手作りPNG → 8個のカテゴリアイコン（Tabler Icons）
- 新配色: パステル系8色、カラーユニバーサルデザイン対応
- GeoJSON typo正規化ユーティリティ追加
- stairsData デッドコード除去
- vending.tsx 削除（circulationに統合）

Refs: TASK-symbol-unification

### Features

* add coordinate transform and CRS utility modules ([ffa746a](https://github.com/htlost/frontieratlas/commit/ffa746adeb54a97e9f51fcda7c601bb33265491e))
* add floor surface polygon layer below unit/section ([66227ee](https://github.com/htlost/frontieratlas/commit/66227ee5472b14463879e266b91effb09d508ab2))
* **map:** add floor-colored building layer and reorganize layer order ([86b252d](https://github.com/htlost/frontieratlas/commit/86b252d7422702c2661461646de4ef9d264eb82d))
* **map:** add native compass ornament (top-right) ([e2e1f94](https://github.com/htlost/frontieratlas/commit/e2e1f94ffd88b1684e5e11ce16ba16dab21488e1))
* **map:** add symbolSortKey priority to special unit symbols ([c7172d3](https://github.com/htlost/frontieratlas/commit/c7172d3dbf361de7d60c0a6f57e6bda86191a4cc))
* **map:** change dynamicCenter breakpoints from inset to narrowBy ([5e6a72d](https://github.com/htlost/frontieratlas/commit/5e6a72deec808ac0939c9bc9c02d920ae5b8f791))
* **map:** redesign indoor map visuals and camera control ([1255e62](https://github.com/htlost/frontieratlas/commit/1255e62f5dc8387e20fcdf738075a36f13891bc8))
* **map:** シンボル・カテゴリ体系を全面刷新 ([4ac5559](https://github.com/htlost/frontieratlas/commit/4ac5559243ceafe82f150364c5feeb04dfc8b706))
* **map:** マップアイコンデザイン刷新 ([e5fcae8](https://github.com/htlost/frontieratlas/commit/e5fcae85c4801beb8c5a8f135de45bf891c1ce8f)), closes [#444444](https://github.com/htlost/frontieratlas/issues/444444)
* **map:** マップレイヤー順序調整とグレーアウト実装 ([60bfd9b](https://github.com/htlost/frontieratlas/commit/60bfd9b7d2d0bd92fdedcf2f537469bee28ac6a5))
* **mobile:** detach map from global tab background into home tab ([0614db5](https://github.com/htlost/frontieratlas/commit/0614db5fe737ce00adcacdb2cf47fd09b20d2e55))
* **mobile:** remove calendar tab from navigation ([7f9102c](https://github.com/htlost/frontieratlas/commit/7f9102c9ac85d0ee65c39ddb412a94fdd98188bb))
* SDK Version Up ([8ff7cdb](https://github.com/htlost/frontieratlas/commit/8ff7cdbab1a3428571565050e0faa379b91977a5))


### Bug Fixes

* **map:** add glyphs endpoint to resolve empty resource URL errors ([fb800f8](https://github.com/htlost/frontieratlas/commit/fb800f8998f5c1eb838ed4880f39136742cf07fa))
* **map:** categoryIcons PNGのパスをassets/直下に修正 ([fe5e870](https://github.com/htlost/frontieratlas/commit/fe5e87055aa49f908596b945d0c05025dacd4bee))
* **map:** resolve CJK glyph 404 errors by setting localIdeographFontFamily ([b92f15a](https://github.com/htlost/frontieratlas/commit/b92f15a2b3130a269859c623475f3bfe321f86a6))
* remove debug code, keep collinear sanitization for earcut crash fix ([15dfbc8](https://github.com/htlost/frontieratlas/commit/15dfbc8ca002b95bccb77da33ecb1bf0b5f48501))
* SQLite concurrency and glyph 404 issues, unify typography constants ([06e9fbd](https://github.com/htlost/frontieratlas/commit/06e9fbdc905b71d6b7937d804d81c11109bdb6e1))


### Performance Improvements

* floor switch optimization (Phase 1+2) — reduce ShapeSource 45→3, preload all floors in memory, instant switching ([e06b421](https://github.com/htlost/frontieratlas/commit/e06b421680c1ca5433dca368c8f741c237291772))


### Documentation

* add project README, index, and meta context files ([294e429](https://github.com/htlost/frontieratlas/commit/294e429b03c591bbc591bc39b779b268fb037cb8))
* move root impl logs to mobile/docs/logs/impl ([b9ee849](https://github.com/htlost/frontieratlas/commit/b9ee849f83e0bcda79608161387c4d2448ba3109))
* move root shared docs to mobile/docs/shared ([645f58e](https://github.com/htlost/frontieratlas/commit/645f58e356c35b328c32b34f0da4260623628589))
* sort inbox handoff files into appropriate log dirs ([de6343b](https://github.com/htlost/frontieratlas/commit/de6343bbd20b02a0d95afac0b6e0fea4bbd9a3bd))
* マップレイヤー順序調整リリースログ追加 ([5c05d30](https://github.com/htlost/frontieratlas/commit/5c05d3076df1b3a25fd75eb05c32266be18896dd))


### Code Refactoring

* **map:** batch-load GeoJSON data before MapLibre mount ([537ec7b](https://github.com/htlost/frontieratlas/commit/537ec7be9132590a3bca42f49c1aa1a5da21c8d1))
* **map:** improve code formatting in MapRoot and useBatchMapData ([db67a4a](https://github.com/htlost/frontieratlas/commit/db67a4a0d9b3d8b76a81b02332afe34a52d80d56))
* **map:** unify special symbols into single SymbolLayer with match expressions ([c9b5ca9](https://github.com/htlost/frontieratlas/commit/c9b5ca983d45ab47d94b75541364313eb14a0679))
* remove zoomBound.ts, update boundsBound for meter-based camera control ([7897073](https://github.com/htlost/frontieratlas/commit/78970734e4eb39fb1af7edd059c7a2e5ddb15488))
* use meter-based inset for dynamicCenter breakpoints instead of absolute coordinates ([620e172](https://github.com/htlost/frontieratlas/commit/620e1727a9e5c9d307669f20b7dbd185e1d22693))

### [0.16.2](https://github.com/htlost/frontieratlas/compare/v0.16.1...v0.16.2) (2026-07-08)


### Bug Fixes

* **android:** network timeout + MapLibre IndexOutOfBoundsException ([f930b0e](https://github.com/htlost/frontieratlas/commit/f930b0e03d5c5adf3ff3dcb19fc845c56e1a3819))
* cross-platform network timeout + GeoJSON sanitization ([5d053c1](https://github.com/htlost/frontieratlas/commit/5d053c1a9c75b4c010a93842db0179ab3c16d786))
* deduplicate consecutive polygon coordinates to prevent MapLibre Native crash ([ade4ef6](https://github.com/htlost/frontieratlas/commit/ade4ef62f3142bb24f5826ec7dee2583ff50a56f))


### Documentation

* add coordinate dedup release log ([9041346](https://github.com/htlost/frontieratlas/commit/904134688649571df03e6268be11cfa03b57f14e))
* add v0.16.1 release log ([66e8cee](https://github.com/htlost/frontieratlas/commit/66e8cee2f5aaf9b402217fc250cb989b4e16370f))

### [0.16.1](https://github.com/htlost/frontieratlas/compare/v0.16.0...v0.16.1) (2026-07-08)


### Bug Fixes

* switch REMOTE_BASE_URL from broken R2 direct URL to Worker proxy ([0eca574](https://github.com/htlost/frontieratlas/commit/0eca574f27014c890c2196830806546124b2b134))


### Documentation

* add implementation, review, and testing logs for R2 proxy fix and lint fixes ([a41cf93](https://github.com/htlost/frontieratlas/commit/a41cf93d6bd582fa2ec5132d1cb0b5d33fff094b))

## [0.16.0](https://github.com/htlost/frontieratlas/compare/v0.15.6...v0.16.0) (2026-07-07)


### Features

* **infra:** setup Cloudflare R2 + Workers for GeoJSON distribution ([3fe1374](https://github.com/htlost/frontieratlas/commit/3fe1374d58119160f4618410c0f78a16dce39434))
* **quota:** add free-tier quota tracking and graceful degradation ([ee65b5d](https://github.com/htlost/frontieratlas/commit/ee65b5d24ee817c36e471350a4e81fd2fe6a1dcf))
