import { atomicWrite } from "@/src/infra/FileSystem/AtomicFileSystem";
import { stringifyJson } from "@/src/infra/GeoJsonParse/geojsonParser";
import { OperateFile } from "../diff/types";
import { geoJsonMap } from "../geojsonAssetMap";
import { IMDF_BASE_DIR } from "../pathConfig";

export function addFiles(addList: OperateFile[]): void {
  addList.forEach((f) => {
    const file = geoJsonMap[f.logicalId];
    if (!file) throw new Error(`GeoJSON not found: ${f.logicalId}`);

    atomicWrite(IMDF_BASE_DIR + file.relativePath, stringifyJson(file.content));
    // console.log(file.content);
  });
}
