import { atomicWrite } from "@/src/infra/FileSystem/fileSystem";
import { stringifyJson } from "@/src/infra/jsonParse/jsonParser";
import geoJsonMap, { MapId } from "../../geojsonAssetMap";
import {
  DownloadVerifyOptions,
  downloadWithVerify,
} from "./downloadWithVerify";

type SaveOptions = DownloadVerifyOptions & {
  id: MapId;
};

export async function saveJsonWithFallback({
  id,
  url,
  tmpPath,
  finalPath,
  expectedSize,
  expectedSha256,
  maxRetry,
}: SaveOptions): Promise<{ size: number; hash: string }> {
  try {
    const { size, hash } = await downloadWithVerify({
      url,
      tmpPath,
      finalPath,
      expectedSize,
      expectedSha256,
      maxRetry,
    });
    return { size, hash };
  } catch (e) {
    try {
      // ローカルのアセットから取得したデータをローカルへ保存する
      const originData = geoJsonMap[id].content;
      const originTxt = stringifyJson(originData);

      // atomic write
      atomicWrite(finalPath, originTxt);

      return {
        size: originTxt.length,
        hash: "fallback-from-asset",
      };
    } catch (fallbackError) {
      throw fallbackError;
    }
  }
}
