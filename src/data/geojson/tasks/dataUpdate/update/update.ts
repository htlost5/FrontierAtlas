import { expoExists } from "@/src/infra/FileSystem/fileSystem";
import { MapId } from "../../../geojsonAssetMap";
import { Manifest } from "../../../manifestType";
import { resolveFileInfo } from "../../../useCase/resolveFileInfo";
import { saveJsonWithFallback } from "../../../useCase/saveWithVerify";

export async function dataUpdate(
  updateList: MapId[],
  DATA_SOURCE_URL: string,
  buildManifest: Manifest,
) {
  for (const id of updateList) {
    const info = resolveFileInfo(id, DATA_SOURCE_URL, buildManifest);

    if (!expoExists(info.finalPath)) continue;

    await saveJsonWithFallback({
      id: id,
      ...info,
      maxRetry: 3,
    });
  }
}

// オフライン版（アセット取得）/ オンライン版（リモート取得）条件分岐で実装
// -> ローカルのfsへ保存

// 対象となっているデータの取得
// 上書き
