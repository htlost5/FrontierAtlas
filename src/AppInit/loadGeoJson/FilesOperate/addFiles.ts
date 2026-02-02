import { expoWrite } from "@/src/infra/FileSystem/expofilesystem";
import { OperateFile } from "../diff/types";
import { geoJsonMap } from "../geojsonRegistry";
import { IMDF_BASE_DIR } from "../pathConfig";
import { stringifyJson } from "@/src/infra/GeoJsonParse/geojsonParser";

export function addFiles(addList: OperateFile[]): void {
  addList.forEach((f) => {
    const file = geoJsonMap[f.logicalId];
    if (!file) throw new Error(`GeoJSON not found: ${f.logicalId}`);

    expoWrite(IMDF_BASE_DIR + file.relativePath, stringifyJson(file.content));
  });
}
