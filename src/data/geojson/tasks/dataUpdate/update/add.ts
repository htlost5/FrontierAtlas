import { MapId } from "../../../geojsonAssetMap";
import { BuildManifest, LocalManifest } from "../../../manifestType";
import { resolveFileInfo } from "../../../useCase/resolveFileInfo";
import { saveJsonWithFallback } from "../../../useCase/saveWithVerify";

export async function dataAdd(
  addList: MapId[],
  DATA_SOURCE_URL: string,
  buildManifest: BuildManifest,
  localManifest: LocalManifest,
): Promise<LocalManifest> {
  for (const id of addList) {
    const info = resolveFileInfo(id, DATA_SOURCE_URL, buildManifest);

    const { size, hash } = await saveJsonWithFallback({
      id: id,
      ...info,
      maxRetry: 3,
    });
  }

  return localManifest;
}

// オフライン版（アセット取得）/ オンライン版（リモート取得）条件分岐で実装
// -> ローカルのfsへ保存
