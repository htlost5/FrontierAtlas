import { expoExists } from "@/src/infra/FileSystem/fileSystem";
import { MapId } from "../../../geojsonAssetMap";
import { BuildManifest, LocalManifest } from "../../../manifestType";
import { saveJsonWithFallback } from "../../../useCase/download/saveWithVerify";
import { resolveFileInfo } from "../../../useCase/manifest/resolveFileInfo";

export async function dataUpdate(
  updateList: MapId[],
  DATA_SOURCE_URL: string,
  buildManifest: BuildManifest,
  localManifest: LocalManifest,
): Promise<LocalManifest> {
  for (const id of updateList) {
    const info = resolveFileInfo(id, DATA_SOURCE_URL, buildManifest);

    if (!expoExists(info.finalPath)) continue;

    const { size, hash } = await saveJsonWithFallback({
      id: id,
      ...info,
      maxRetry: 3,
    });

    localManifest.files[id] = {
      relativePath: buildManifest.files[id].relativePath,
      size: size,
      sha256: hash,
    };
  }
  return localManifest;
}

// オフライン版（アセット取得）/ オンライン版（リモート取得）条件分岐で実装
// -> ローカルのfsへ保存

// 対象となっているデータの取得
// 上書き
