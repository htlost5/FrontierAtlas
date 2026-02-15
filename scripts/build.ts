import { renameGeojsonToJson } from "./renameGeojsonToJson";
import { generateBuildManifest } from "./generate_buildManifest";
import { generateGeojsonAssetMap } from "./generate_geojsonAssetMap";

async function buildAll() {
  await renameGeojsonToJson();
  await generateBuildManifest();
  generateGeojsonAssetMap();
}

buildAll();
