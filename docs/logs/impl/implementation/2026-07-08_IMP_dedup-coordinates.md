---
agent: IMP
task_id: TASK-dedup-coordinates
date: 2026-07-08
status: done
category: log
destination: logs/impl/implementation/
related:
  - "[TASK-dedup-coordinates]"
tags:
  - IMP
  - implementation
  - deduplication
  - mapLibre
---

# Implementation Log: Consecutive Duplicate Coordinates Fix

## Summary
Fixed `java.lang.IndexOutOfBoundsException` in MapLibre Native caused by consecutive duplicate coordinates in polygon rings within section GeoJSON files. Added coordinate deduplication to `transform.js`.

## Changes Made

### 1. `tools/map-assets/transformer/transform.js`
Added three functions and modified `transformGeoJSONFile`:

- **`coordinatesEqual(a, b)`** — compares two `[lng, lat]` pairs with 1e-12 floating-point tolerance
- **`removeConsecutiveDuplicates(coords)`** — removes consecutive duplicate coordinates from a ring, ensures closing
- **`sanitizeGeometry(geometry)`** — recursively processes `Polygon` and `MultiPolygon` geometries
- **`sanitizeFeature(feature)`** — applies sanitization to a feature, returns null if geometry becomes invalid

Modified `transformGeoJSONFile()` to:
1. After `fid` deletion, apply `sanitizeFeature` to all features
2. Filter out features that became invalid (null) after sanitization

### Pipeline Execution
1. Ran `node transformer/transform.js` — all 24 files transformed successfully
2. Ran `node builder/build-release.js v0.0.0` — release built successfully
3. Verified all 5 section files (floor1-5) contain **0 consecutive duplicate coordinates**

### R2 Upload
Uploaded to `geo-data-frontieratlas/releases/v0.0.0/`:
- `data/imdf/studyhall/sections/floor{1-5}.json`
- `data/manifest.json`
- `data/version.json`

## Verification
- Dedup check script confirmed 0 consecutive duplicates across all 5 section files
- File sizes and structure are valid
