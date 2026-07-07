// updateRegistry の公開エクスポートをまとめる。
import type { FeatureCollection } from "geojson";
import { expoRead } from "@/src/infra/FileSystem/fileSystem";
import { geojsonRegistry } from "@/src/infra/geojson/geojsonRegistry";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import { MapId } from "../../geojsonAssetMap";
import { BuildManifest } from "@/src/domain/manifestTypes";
import type { UpdateType } from "../setUpdatePlan/types";

async function loadAndRegister(id: MapId, baseFiles: BuildManifest["files"]) {
  const sourceTxt = await expoRead(baseFiles[id].relativePath);
  const data = parseJson<FeatureCollection>(sourceTxt);
  geojsonRegistry.set(id, data);
}

export async function updateRegistry(
  buildManifest: BuildManifest,
  updatePlan?: UpdateType,
) {
  const baseFiles = buildManifest.files;

  // 差分更新: UpdateType が指定された場合
  if (updatePlan) {
    // add / update: 再読み込みして登録
    for (const id of [...updatePlan.add, ...updatePlan.update]) {
      await loadAndRegister(id, baseFiles);
    }
    // delete: 削除
    for (const id of updatePlan.delete) {
      geojsonRegistry.delete(id);
    }
    return;
  }

  // Fallback: 全件再読み込み
  geojsonRegistry.clear();
  const ids = Object.keys(baseFiles) as MapId[];
  for (const id of ids) {
    await loadAndRegister(id, baseFiles);
  }
}
