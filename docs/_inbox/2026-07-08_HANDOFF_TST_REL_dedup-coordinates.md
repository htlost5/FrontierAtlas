---
agent: TST
task_id: TASK-dedup-coordinates
date: 2026-07-08
status: pending
category: log
destination: logs/impl/testing/
related:
  - "[HANDOFF IMP->REV](./2026-07-08_HANDOFF_IMP_REV_dedup-coordinates.md)"
  - "[REV Log](../logs/impl/review/2026-07-08_REV_coordinate-dedup.md)"
  - "[TST Log](../logs/impl/testing/2026-07-08_TST_dedup-coordinates.md)"
tags:
  - TST
  - handoff
  - coordinate-dedup
---

# HANDOFF: TST -> REL

## Metadata
| Field | Value |
|-------|-------|
| **From** | TST |
| **To** | REL |
| **Task ID** | TASK-dedup-coordinates |
| **Status** | success |
| **Confidence** | high |
| **Handoff Type** | forward |

---

## Task Context (inherited)

### Original Request
Fix consecutive duplicate coordinates in studyhall/sections/floor{1-5}.json polygon rings, which cause MapLibre Native earcut triangulation to crash with java.lang.IndexOutOfBoundsException: Index 2 out of bounds for length 2.

### Constraints
- Use 1e-12 floating-point tolerance for coordinate comparison
- Ensure rings stay closed after dedup
- Skip rings with < 3 unique points (invalid polygons)

### Chain History
| Step | Agent | Status | Summary |
|------|-------|--------|---------|
| 1 | IMP | done | Added dedup functions to transform.js, ran pipeline, built release v0.0.0, uploaded to R2 |
| 2 | REV | approved | Code review: dedup logic correct, ring closure preserved, epsilon appropriate |
| 3 | TST | passed | 0 duplicates across 414 rings, 22 files valid, all structures intact |

---

## Key Findings / Decisions

- **Root cause confirmed**: Consecutive duplicate coordinates in GeoJSON polygon rings -> MapLibre earcut IndexOutOfBoundsException
- **Fix**: coordinatesEqual(1e-12 epsilon) + removeConsecutiveDuplicates in transform.js
- **Test result**: ALL PASS - 0 consecutive duplicates across all 22 output files (414 rings scanned)
- **Edge case**: 1 ring in floor3.json has 2e-14 deg closure difference (floating-point artifact, no impact)
- **Release**: v0.0.0 data uploaded to R2 geo-data-frontieratlas/releases/v0.0.0/

---

## Artifacts
| Path | Type | Description |
|------|------|-------------|
| tools/map-assets/transformer/transform.js | code | Dedup implementation (coordinatesEqual, removeConsecutiveDuplicates, sanitizeGeometry, sanitizeFeature) |
| tools/map-assets/build/imdf/ | data | Cleaned GeoJSON output (22 files) |
| tools/map-assets/releases/v0.0.0/data/ | data | Release package (manifests, sections, units, etc.) |
| docs/logs/impl/testing/2026-07-08_TST_dedup-coordinates.md | log | Full test report |

---

## Routing

### Handoff
- **To**: REL
- **Action**: Tag release, commit, and deploy cleaned GeoJSON data
- **CRITICAL差し戻し**: N/A (all gates passed)
