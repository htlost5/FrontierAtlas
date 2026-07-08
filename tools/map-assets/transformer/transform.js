// transform-geojson-to-json.js
const fs = require('fs');
const path = require('path');

// -----------------------------
// 入力・出力パス
// -----------------------------
const INPUT_BUILD = path.join(__dirname, '..', 'exports', 'build'); // GitHub Actions用
const INPUT_BASE  = path.join(__dirname, '..', 'exports', 'base');  // venue / address.json
const OUTPUT_ROOT = path.join(__dirname, '..', 'build', 'imdf');     // 出力先

// -----------------------------
// root直下に出す footprint 系の名前
// -----------------------------
const FOOTPRINT_OUTPUT_NAME = {
  studyhall: 'footprint.json',
  interact:  'footprint.json', // tree に合わせて必要なら 'foorprint.json'
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
  const baseAddress = path.join(INPUT_BASE, 'address.json');
  if (fs.existsSync(baseAddress)) {
    fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
    fs.copyFileSync(baseAddress, path.join(OUTPUT_ROOT, 'address.json'));
    console.log('[COPIED] address.json');
  }

  // venue フォルダ
  const baseVenue = path.join(INPUT_BASE, 'venue');
  const outVenue  = path.join(OUTPUT_ROOT, 'venue');
  if (fs.existsSync(baseVenue)) {
    fs.cpSync(baseVenue, outVenue, { recursive: true });
    console.log('[COPIED] venue/');
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
  if (result.length >= 3 && !coordinatesEqual(result[0], result[result.length - 1])) {
    result.push([...result[0]]);
  }
  return result;
}

function sanitizeGeometry(geometry) {
  if (!geometry || !geometry.type) return geometry;

  if (geometry.type === 'Polygon') {
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

  if (geometry.type === 'MultiPolygon') {
    const cleaned = [];
    for (const polygon of geometry.coordinates) {
      const sanitized = sanitizeGeometry({ type: 'Polygon', coordinates: polygon });
      if (sanitized) {
        cleaned.push(sanitized.coordinates);
      }
    }
    if (cleaned.length === 0) return null;
    return { ...geometry, coordinates: cleaned };
  }

  // Point, LineString, MultiPoint, MultiLineString, GeometryCollection — pass through
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
  const raw = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(raw);

  if (Array.isArray(data.features)) {
    for (const feature of data.features) {
      if (feature?.properties && Object.prototype.hasOwnProperty.call(feature.properties, 'fid')) {
        delete feature.properties.fid;
      }
    }

    // Sanitize features: remove consecutive duplicate coordinates
    data.features = data.features
      .map(sanitizeFeature)
      .filter(Boolean);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[OK] ${inputPath} -> ${outputPath}`);
}

// -----------------------------
// 入力パスから出力パスへ変換
// -----------------------------
function mapOutputPath(inputPath) {
  const rel = path.relative(INPUT_BUILD, inputPath);
  const parts = rel.split(path.sep);
  const root = parts[0];
  const fileName = path.parse(parts[parts.length - 1]).name;

  if (!['studyhall', 'interact'].includes(root)) return null;

  // root直下 footprint / stairs
  if (fileName === 'footprint' || fileName === 'foorprint') {
    return path.join(OUTPUT_ROOT, root, 'footprint.json');
  }
  if (fileName === 'stairs') {
    return path.join(OUTPUT_ROOT, root, 'stairs.json');
  }

  // floors/floorN
  if (parts[1] === 'floors' && parts.length >= 3) {
    const floorName = parts[2];
    if (fileName.toLowerCase() === 'units') {
      return path.join(OUTPUT_ROOT, root, 'units', `${floorName}.json`);
    }
    if (fileName.toLowerCase() === 'section') {
      return path.join(OUTPUT_ROOT, root, 'sections', `${floorName}.json`);
    }
  }

  // levels 以下
  if (parts[1] === 'levels') {
    return path.join(OUTPUT_ROOT, root, 'levels', `${fileName}.json`);
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

    if (!entry.name.toLowerCase().endsWith('.geojson')) continue;

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
console.log('[START] Cleaning output...');
cleanOutputRoot(OUTPUT_ROOT);

console.log('[START] Copy base files...');
copyBaseFiles();

console.log('[START] Transforming .geojson -> .json...');
walk(INPUT_BUILD);

console.log('[DONE]');