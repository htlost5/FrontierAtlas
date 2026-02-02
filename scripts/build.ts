import { generateBuildManifest } from "./generate_buildManifest";
import { generateGeojsonRegistry } from "./generate_geojsonRegistry";

async function buildAll() {
    await generateBuildManifest();
    generateGeojsonRegistry();
}

buildAll();