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
import { loadAssetGeoJson } from "./assetDataSet";
import loadRemoteGeoJson from "./remoteDataSet";

function handleLoadError(e: unknown): "fallback_asset" | "abort" {
  if (
    e instanceof NetworkError ||
    e instanceof VersionFetchError ||
    e instanceof SizeMismatchError ||
    e instanceof Sha256MismatchError ||
    e instanceof ValidationError
  ) {
    return "fallback_asset";
  }

  if (e instanceof VersionMismatchError) {
    console.error("Server version mismatch. Abort.");
    return "abort";
  }

  console.error("Unexpected error: ", e);
  return "abort";
}

export async function loadAllGeoJson(
  isOffline: boolean,
  onSourceChange?: (source: DataSource) => void,
) {
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
    const action = handleLoadError(e);
    if (action === "fallback_asset") {
      await loadAssetGeoJson();
      onSourceChange?.("asset");
    } else {
      throw e;
    }
  }
}
