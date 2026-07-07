// geojson の公開エクスポートをまとめる。
import { DataSource } from "@/src/AppInit/hooks/usePrepareData";
import {
  Sha256MismatchError,
  SizeMismatchError,
  ValidationError,
  VersionMismatchError,
} from "@/src/domain/ManifestErrors";
import { NetworkError } from "@/src/domain/NetworkErrors";
import { VersionFetchError } from "@/src/domain/VersionErrors";
import expoWalk from "@/src/infra/FileSystem/walk";
import { basePath } from "../paths";
import { loadAssetGeoJson } from "./assetDataSet";
import loadRemoteGeoJson from "./remoteDataSet";

export async function loadAllGeoJson(
  isOffline: boolean,
  onSourceChange?: (source: DataSource) => void,
) {
  // ディレクトリ内ファイル確認
  console.log(`files: ${expoWalk(basePath)}`);

  // 最初にネットを確認　-> offlineだったらアセットから読み込み
  if (isOffline) {
    await loadAssetGeoJson();
    onSourceChange?.("asset");
    return;
  }

  try {
    await loadRemoteGeoJson();
    onSourceChange?.("remote");
  } catch (e) {
    console.warn("remote load failed:", e);
    if (
      e instanceof NetworkError ||
      e instanceof VersionFetchError ||
      e instanceof SizeMismatchError ||
      e instanceof Sha256MismatchError ||
      e instanceof ValidationError
    ) {
      await loadAssetGeoJson();
      onSourceChange?.("asset");
    } else if (e instanceof VersionMismatchError) {
      console.error("Server version mismatch. Abort.");
      throw e;
    } else {
      console.error("Unexpected error: ", e);
      throw e;
    }
  }
}

// geoDataloader 別関数を作る
// network, datasource, lastUpdateの情報を保持
// 必要となったときにのみ更新する
