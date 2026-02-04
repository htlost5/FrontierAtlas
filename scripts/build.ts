import { generateBuildManifest } from "./generate_buildManifest";
import { generateGeojsonAssetMap } from "./generate_geojsonAssetMap";

async function buildAll() {
  await generateBuildManifest();
  generateGeojsonAssetMap();
}

buildAll();
