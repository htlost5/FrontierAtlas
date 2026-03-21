import { atomicWrite } from "@/src/infra/FileSystem/AtomicFileSystem";
import { expoRemove } from "@/src/infra/FileSystem/expofilesystem";
import { stringifyJson } from "@/src/infra/GeoJsonParse/geojsonParser";
import { OperateFile } from "../diff/types";
import { geoJsonMap } from "../geojsonAssetMap";
import { IMDF_BASE_DIR } from "../pathConfig";

export function updateFiles(updateList: OperateFile[]): void {
  updateList.forEach((f) => {
    const targetPath = IMDF_BASE_DIR + f.relativePath;
    expoRemove(targetPath);

    const file = geoJsonMap[f.logicalId];
    if (!file) throw new Error(`GeoJSON not found: ${f.logicalId}`);

    atomicWrite(targetPath, stringifyJson(file.content));
  });
}
