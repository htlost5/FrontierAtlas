import { Manifest } from "../Manifest/manifestType";
import { DiffFile, DiffResult, OperateFile } from "./types";

export function buildToDiffFiles(manifest: Manifest): DiffFile[] {
  return Object.values(manifest.files).map((f) => ({
    logicalId: f.logicalId,
    relativePath: f.relativePath,
    size: f.size,
    version: f.version,
  }));
}

export function buildToOperateFiles(manifest: Manifest): OperateFile[] {
  return Object.values(manifest.files).map((f) => ({
    logicalId: f.logicalId,
    relativePath: f.relativePath,
  }));
}

export function fullReset(build: Manifest, cache: Manifest): DiffResult {
  return {
    add: buildToOperateFiles(build),
    remove: buildToOperateFiles(cache),
    update: [],
  };
}
