// add のGeoJSONデータ処理を定義する。
import { MapId } from "../../../../geojsonAssetMap";
import { BuildManifest, LocalManifest } from "@/src/domain/manifestTypes";
import { downloadWithVerify } from "../../../useCase/download/downloadWithVerify";
import { resolveFileInfo } from "../../../useCase/manifest/resolveFileInfo";

export async function remoteDataAdd(
  addList: MapId[],
  DATA_SOURCE_URL: string,
  buildManifest: BuildManifest,
  localManifest: LocalManifest,
): Promise<LocalManifest> {
  for (const id of addList) {
    const info = resolveFileInfo(id, DATA_SOURCE_URL, buildManifest);

    const { size, hash } = await downloadWithVerify({
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
