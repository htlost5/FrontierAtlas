---
agent: IMP
task_id: TASK-dedup-coordinates
date: 2026-07-08
status: pending
category: log
destination: logs/impl/implementation/
related: []
tags:
  - IMP
  - handoff
  - implementation
---

# HANDOFF: IMP → REV

## Metadata
| Field | Value |
|-------|-------|
| **From** | IMP |
| **To** | REV |
| **Task ID** | TASK-dedup-coordinates |
| **Status** | success |
| **Confidence** | high |
| **Handoff Type** | forward |

---

## Task Context（継承・追記セクション）

### Original Request
Fix consecutive duplicate coordinates in `studyhall/sections/floor{1-5}.json` polygon rings, which cause MapLibre Native earcut triangulation to crash with `java.lang.IndexOutOfBoundsException: Index 2 out of bounds for length 2`.

### Changes Required
1. Add coordinate deduplication functions to `tools/map-assets/transformer/transform.js`
2. Re-run transformation pipeline → build release v0.0.0 → verify no duplicates remain
3. Upload clean data to R2

### Constraints
- Use 1e-12 floating-point tolerance for coordinate comparison
- Ensure rings stay closed after dedup
- Skip rings with < 3 unique points (invalid polygons)

### Chain History
| Step | Agent | Status | Summary |
|------|-------|--------|---------|
| 1 | IMP | done | Implemented dedup, transformed, built release, uploaded to R2 |

---

## Key Findings / Decisions

- **Root cause confirmed**: Source `.geojson` files had the same coordinate repeated 2-3 times consecutively in polygon rings
- **Dedup approach**: `removeConsecutiveDuplicates` uses `coordinatesEqual` with epsilon 1e-12, preserves ring closure
- **All 5 section files verified**: 0 consecutive duplicates remaining after transformation
- **R2 upload complete**: All section files, manifest.json, and version.json uploaded to `geo-data-frontieratlas/releases/v0.0.0/`

---

## Artifacts
| Path | Type | Description |
|------|------|-------------|
| `tools/map-assets/transformer/transform.js` | code | Added `coordinatesEqual`, `removeConsecutiveDuplicates`, `sanitizeGeometry`, `sanitizeFeature`; modified `transformGeoJSONFile` |
| `tools/map-assets/releases/v0.0.0/data/imdf/studyhall/sections/floor1.json` | data | Cleaned section floor1 (0 duplicates) |
| `tools/map-assets/releases/v0.0.0/data/imdf/studyhall/sections/floor2.json` | data | Cleaned section floor2 (0 duplicates) |
| `tools/map-assets/releases/v0.0.0/data/imdf/studyhall/sections/floor3.json` | data | Cleaned section floor3 (0 duplicates) |
| `tools/map-assets/releases/v0.0.0/data/imdf/studyhall/sections/floor4.json` | data | Cleaned section floor4 (0 duplicates) |
| `tools/map-assets/releases/v0.0.0/data/imdf/studyhall/sections/floor5.json` | data | Cleaned section floor5 (0 duplicates) |
| `tools/map-assets/releases/v0.0.0/data/manifest.json` | data | Updated manifest with new sha256 hashes |
| `tools/map-assets/releases/v0.0.0/data/version.json` | data | Updated version manifest |
| `docs/logs/impl/implementation/2026-07-08_IMP_dedup-coordinates.md` | log | Implementation details |

---

## Open Questions

None.

---

## Next Actions

1. **REV**: Review the `transform.js` changes for correctness and edge cases (empty geometries, null features, non-polygon types)
2. **REV**: Verify that the dedup logic does not accidentally modify valid geometries
3. **TST**: Run the full data pipeline end-to-end
4. **REL**: Confirm R2 objects are accessible from the Worker
