// transform-geojson-to-json.js
const fs = require("fs");
const path = require("path");
const proj4 = require("proj4");

// -----------------------------
// 入力・出力パス
// -----------------------------
const INPUT_BUILD = path.join(__dirname, "..", "exports", "build"); // GitHub Actions用
const INPUT_BASE = path.join(__dirname, "..", "exports", "base"); // venue / address.json
const OUTPUT_ROOT = path.join(__dirname, "..", "build", "imdf"); // 出力先

// -----------------------------
// ファイル名マッピング定数（新 exports/build 構造対応）
// -----------------------------
const BUILDING_LEVEL_OUTPUT = {
  surface: "surface.json",
  stairs: "stairs.json",
};

const FLOOR_LEVEL_OUTPUT = {
  rooms: "rooms",
  surface: "surface",
  walkable: "walkable",
};

// -----------------------------
// 出力先を空にする（venue, address.jsonは残さず上書き）
// -----------------------------
function cleanOutputRoot(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    fs.rmSync(path.join(dir, entry.name), { recursive: true, force: true });
    console.log(`[REMOVED] ${entry.name}`);
  }
}

// -----------------------------
// exports/base の venue と address.json をコピー
// -----------------------------
function copyBaseFiles() {
  // address.json
  const baseAddress = path.join(INPUT_BASE, "address.json");
  if (fs.existsSync(baseAddress)) {
    fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
    fs.copyFileSync(baseAddress, path.join(OUTPUT_ROOT, "address.json"));
    console.log("[COPIED] address.json");
  }

  // venue フォルダ
  const baseVenue = path.join(INPUT_BASE, "venue");
  const outVenue = path.join(OUTPUT_ROOT, "venue");
  if (fs.existsSync(baseVenue)) {
    fs.cpSync(baseVenue, outVenue, { recursive: true });
    console.log("[COPIED] venue/");
  }
}

// -----------------------------
// LOCAL_XY projection definition (Azimuthal Equidistant centered on venue)
// -----------------------------
const LOCAL_XY =
  "+proj=aeqd +lat_0=35.49777179199512 +lon_0=139.6784895108818 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
proj4.defs("LOCAL_XY", LOCAL_XY);

// -----------------------------
// Geometry helper functions for display_point calculation
// -----------------------------

/**
 * Project a polygon ring from EPSG:4326 to LOCAL_XY (forward=true) or back (forward=false).
 * @param {number[][]} ring - Array of [lng, lat] coordinates
 * @param {boolean} forward - true: 4326→LOCAL_XY, false: LOCAL_XY→4326
 * @returns {number[][]} Projected ring
 */
function projectPolygon(ring, forward) {
  const src = forward ? "EPSG:4326" : "LOCAL_XY";
  const dst = forward ? "LOCAL_XY" : "EPSG:4326";
  return ring.map(function (coord) {
    return proj4(src, dst, coord);
  });
}

/**
 * Compute the signed area of a polygon ring (planar geometry in LOCAL_XY).
 * Positive area = counter-clockwise (outer ring).
 * @param {number[][]} ring - Array of [x, y] coordinates in LOCAL_XY
 * @returns {number} Signed area
 */
function polygonArea(ring) {
  var area = 0;
  var n = ring.length;
  for (var i = 0; i < n; i++) {
    var j = (i + 1) % n;
    area += ring[i][0] * ring[j][1];
    area -= ring[j][0] * ring[i][1];
  }
  return area / 2;
}

/**
 * Check if a point is inside a polygon ring using Ray Casting algorithm.
 * @param {number[]} point - [x, y] in LOCAL_XY
 * @param {number[][]} ring - Array of [x, y] in LOCAL_XY
 * @returns {boolean} true if point is inside the ring
 */
function pointInPolygon(point, ring) {
  var x = point[0];
  var y = point[1];
  var inside = false;
  var n = ring.length;
  for (var i = 0, j = n - 1; i < n; j = i++) {
    var xi = ring[i][0];
    var yi = ring[i][1];
    var xj = ring[j][0];
    var yj = ring[j][1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Compute a point guaranteed to be on the surface of a polygon ring.
 * 1. Calculate vertex centroid of the outer ring.
 * 2. If centroid is inside the ring, return it (projected back to EPSG:4326).
 * 3. Otherwise, find the longest horizontal segment crossing the polygon
 *    and return its midpoint.
 * @param {number[][]} ring - Array of [lng, lat] coordinates in EPSG:4326
 * @returns {number[]} [lng, lat] point on the surface
 */
function pointOnSurface(ring) {
  var projected = projectPolygon(ring, true);
  var n = projected.length;
  var cx = 0;
  var cy = 0;
  for (var i = 0; i < n; i++) {
    cx += projected[i][0];
    cy += projected[i][1];
  }
  cx /= n;
  cy /= n;

  // If centroid is inside, use it
  if (pointInPolygon([cx, cy], projected)) {
    return proj4("LOCAL_XY", "EPSG:4326", [cx, cy]);
  }

  // Centroid is outside — find longest horizontal segment inside the polygon
  var bestMid = null;
  var bestLen = -1;

  for (var i = 0; i < n; i++) {
    var j = (i + 1) % n;
    var x1 = projected[i][0];
    var y1 = projected[i][1];
    var x2 = projected[j][0];
    var y2 = projected[j][1];

    // Skip non-horizontal edges (within tolerance)
    if (Math.abs(y2 - y1) > 1e-10) continue;

    var yLevel = y1;
    // Find intersections of the horizontal line at yLevel with all edges
    var intersections = [];
    for (var k = 0; k < n; k++) {
      var l = (k + 1) % n;
      var xk = projected[k][0];
      var yk = projected[k][1];
      var xl = projected[l][0];
      var yl = projected[l][1];

      // Edge is horizontal — skip (it's the edge we're on or parallel)
      if (Math.abs(yl - yk) < 1e-10) continue;

      // Check if the horizontal line crosses this edge
      if ((yk <= yLevel && yl > yLevel) || (yl <= yLevel && yk > yLevel)) {
        var t = (yLevel - yk) / (yl - yk);
        var xi = xk + t * (xl - xk);
        // Clamp intersection to within edge bounds
        var minX = Math.min(xk, xl);
        var maxX = Math.max(xk, xl);
        if (xi >= minX - 1e-10 && xi <= maxX + 1e-10) {
          intersections.push(xi);
        }
      }
    }

    intersections.sort(function (a, b) {
      return a - b;
    });

    // Pair intersections and find longest segment
    for (var m = 0; m < intersections.length - 1; m += 2) {
      var segLen = intersections[m + 1] - intersections[m];
      if (segLen > bestLen) {
        bestLen = segLen;
        bestMid = [(intersections[m] + intersections[m + 1]) / 2, yLevel];
      }
    }
  }

  if (bestMid) {
    return proj4("LOCAL_XY", "EPSG:4326", bestMid);
  }

  // Fallback: return centroid anyway
  return proj4("LOCAL_XY", "EPSG:4326", [cx, cy]);
}

/**
 * Calculate the total length of a line string (in LOCAL_XY projected space).
 * @param {number[][]} coords - Array of [lng, lat] in EPSG:4326
 * @returns {number} Total length in meters
 */
function lineLength(coords) {
  var projected = projectPolygon(coords, true);
  var len = 0;
  for (var i = 1; i < projected.length; i++) {
    var dx = projected[i][0] - projected[i - 1][0];
    var dy = projected[i][1] - projected[i - 1][1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

/**
 * Get a point at a specific ratio along a line string.
 * @param {number[][]} coords - Array of [lng, lat] in EPSG:4326
 * @param {number} ratio - 0.0 to 1.0 (e.g., 0.5 = midpoint)
 * @returns {number[]} [lng, lat] at the specified ratio
 */
function pointOnLine(coords, ratio) {
  var projected = projectPolygon(coords, true);
  var totalLen = 0;
  var segLens = [];
  for (var i = 1; i < projected.length; i++) {
    var dx = projected[i][0] - projected[i - 1][0];
    var dy = projected[i][1] - projected[i - 1][1];
    var segLen = Math.sqrt(dx * dx + dy * dy);
    segLens.push(segLen);
    totalLen += segLen;
  }

  if (totalLen === 0) {
    // Degenerate line: return start point
    return coords[0];
  }

  var target = totalLen * ratio;
  var accumulated = 0;
  for (var i = 0; i < segLens.length; i++) {
    if (accumulated + segLens[i] >= target || i === segLens.length - 1) {
      var t = segLens[i] > 0 ? (target - accumulated) / segLens[i] : 0;
      var x = projected[i][0] + t * (projected[i + 1][0] - projected[i][0]);
      var y = projected[i][1] + t * (projected[i + 1][1] - projected[i][1]);
      return proj4("LOCAL_XY", "EPSG:4326", [x, y]);
    }
    accumulated += segLens[i];
  }

  return coords[coords.length - 1];
}

/**
 * Compute the display_point for a feature based on its geometry type.
 * @param {object} feature - GeoJSON feature
 * @returns {number[]|null} [lng, lat] or null if unsupported geometry type
 */
function computeDisplayPoint(feature) {
  if (!feature || !feature.geometry || !feature.geometry.type) return null;

  var type = feature.geometry.type;
  var coords = feature.geometry.coordinates;

  switch (type) {
    case "Polygon": {
      var outerRing = coords[0];
      return pointOnSurface(outerRing);
    }
    case "MultiPolygon": {
      // Find polygon with largest area
      var bestArea = -1;
      var bestRing = null;
      for (var i = 0; i < coords.length; i++) {
        var ring = coords[i][0];
        var projRing = projectPolygon(ring, true);
        var area = Math.abs(polygonArea(projRing));
        if (area > bestArea) {
          bestArea = area;
          bestRing = ring;
        }
      }
      return bestRing ? pointOnSurface(bestRing) : null;
    }
    case "LineString": {
      return pointOnLine(coords, 0.5);
    }
    case "MultiLineString": {
      // Find longest line
      var bestLen = -1;
      var bestLine = null;
      for (var i = 0; i < coords.length; i++) {
        var len = lineLength(coords[i]);
        if (len > bestLen) {
          bestLen = len;
          bestLine = coords[i];
        }
      }
      return bestLine ? pointOnLine(bestLine, 0.5) : null;
    }
    case "Point": {
      return [coords[0], coords[1]];
    }
    default: {
      // GeometryCollection, MultiPoint etc. — skip
      return null;
    }
  }
}

// -----------------------------
// Coordinate deduplication (fixes MapLibre earcut crash)
// -----------------------------
function coordinatesEqual(a, b) {
  return Math.abs(a[0] - b[0]) < 1e-12 && Math.abs(a[1] - b[1]) < 1e-12;
}

function removeConsecutiveDuplicates(coords) {
  if (coords.length < 4) return coords; // minimum valid ring
  const result = [coords[0]];
  for (let i = 1; i < coords.length; i++) {
    if (!coordinatesEqual(coords[i], result[result.length - 1])) {
      result.push(coords[i]);
    }
  }
  // Ensure ring is closed
  if (
    result.length >= 3 &&
    !coordinatesEqual(result[0], result[result.length - 1])
  ) {
    result.push([...result[0]]);
  }
  return result;
}

// Remove consecutive duplicate coordinates in a line (no ring closing logic)
function removeConsecutiveDuplicatesLine(coords) {
  if (coords.length < 2) return coords;
  const result = [coords[0]];
  for (let i = 1; i < coords.length; i++) {
    if (!coordinatesEqual(coords[i], result[result.length - 1])) {
      result.push(coords[i]);
    }
  }
  return result;
}

function sanitizeGeometry(geometry) {
  if (!geometry || !geometry.type) return geometry;

  if (geometry.type === "Polygon") {
    const cleaned = [removeConsecutiveDuplicates(geometry.coordinates[0])];
    // Skip outer ring if < 3 unique points → invalid polygon
    if (cleaned[0].length < 4) return null;
    for (let i = 1; i < geometry.coordinates.length; i++) {
      const ring = removeConsecutiveDuplicates(geometry.coordinates[i]);
      if (ring.length >= 4) {
        cleaned.push(ring);
      }
    }
    return { ...geometry, coordinates: cleaned };
  }

  if (geometry.type === "MultiPolygon") {
    const cleaned = [];
    for (const polygon of geometry.coordinates) {
      const sanitized = sanitizeGeometry({
        type: "Polygon",
        coordinates: polygon,
      });
      if (sanitized) {
        cleaned.push(sanitized.coordinates);
      }
    }
    if (cleaned.length === 0) return null;
    return { ...geometry, coordinates: cleaned };
  }

  if (geometry.type === "LineString") {
    const cleaned = removeConsecutiveDuplicatesLine(geometry.coordinates);
    if (cleaned.length < 2) return null;
    return { ...geometry, coordinates: cleaned };
  }

  if (geometry.type === "MultiLineString") {
    const cleaned = [];
    for (const line of geometry.coordinates) {
      const deduped = removeConsecutiveDuplicatesLine(line);
      if (deduped.length >= 2) {
        cleaned.push(deduped);
      }
    }
    if (cleaned.length === 0) return null;
    return { ...geometry, coordinates: cleaned };
  }

  if (geometry.type === "GeometryCollection") {
    const cleaned = [];
    for (const geom of geometry.geometries) {
      const sanitized = sanitizeGeometry(geom);
      if (sanitized) {
        cleaned.push(sanitized);
      }
    }
    if (cleaned.length === 0) return null;
    return { ...geometry, geometries: cleaned };
  }

  // Point, MultiPoint — pass through (no duplicate removal needed)
  return geometry;
}

function sanitizeFeature(feature) {
  if (!feature || !feature.geometry) return feature;
  const sanitized = sanitizeGeometry(feature.geometry);
  if (!sanitized) return null; // geometry became invalid
  return { ...feature, geometry: sanitized };
}

// -----------------------------
// GeoJSON -> JSON
// -----------------------------
function transformGeoJSONFile(inputPath, outputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");
  const data = JSON.parse(raw);

  if (Array.isArray(data.features)) {
    for (const feature of data.features) {
      if (
        feature?.properties &&
        Object.prototype.hasOwnProperty.call(feature.properties, "fid")
      ) {
        delete feature.properties.fid;
      }

      // Compute display_point for each feature
      try {
        var dp = computeDisplayPoint(feature);
        if (dp) {
          feature.properties.display_point = dp;
        }
      } catch (e) {
        console.warn(
          "[WARN] display_point calculation failed for feature " +
            (feature.properties?.id || "unknown") +
            ": " +
            e.message,
        );
      }
    }

    // Sanitize features: remove consecutive duplicate coordinates
    data.features = data.features.map(sanitizeFeature).filter(Boolean);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`[OK] ${inputPath} -> ${outputPath}`);
}

// -----------------------------
// 入力パスから出力パスへ変換（新 exports/build 構造対応）
// -----------------------------
function mapOutputPath(inputPath) {
  const rel = path.relative(INPUT_BUILD, inputPath);
  const parts = rel.split(path.sep);
  const root = parts[0];
  const fileName = path.parse(parts[parts.length - 1]).name;

  if (!["studyhall", "interact"].includes(root)) return null;

  // parts.length === 3: 新しい二層構造（{root}/{layer}/{name}.geojson）
  if (parts.length === 3) {
    // levels/{name}.geojson（変更なし）
    if (parts[1] === "levels") {
      return path.join(OUTPUT_ROOT, root, "levels", `${fileName}.json`);
    }

    if (parts[1] === "building") {
      // building-level: surface / stairs → root 直下
      const outputName = BUILDING_LEVEL_OUTPUT[fileName];
      if (outputName) {
        return path.join(OUTPUT_ROOT, root, outputName);
      }
    } else {
      // floor-level: rooms / surface / walkable → {dir}/{floor}.json
      const floorName = parts[1];
      const dir = FLOOR_LEVEL_OUTPUT[fileName];
      if (dir) {
        return path.join(OUTPUT_ROOT, root, dir, `${floorName}.json`);
      }
    }
  }

  return null;
}

// -----------------------------
// 再帰走査
// -----------------------------
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.name.toLowerCase().endsWith(".geojson")) continue;

    const outputPath = mapOutputPath(fullPath);
    if (!outputPath) {
      console.log(`[SKIP] ${fullPath}`);
      continue;
    }

    transformGeoJSONFile(fullPath, outputPath);
  }
}

// -----------------------------
// 実行
// -----------------------------
console.log("[START] Cleaning output...");
cleanOutputRoot(OUTPUT_ROOT);

console.log("[START] Copy base files...");
copyBaseFiles();

console.log("[START] Transforming .geojson -> .json...");
walk(INPUT_BUILD);

console.log("[DONE]");
