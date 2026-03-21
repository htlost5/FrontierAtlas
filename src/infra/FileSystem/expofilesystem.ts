import { File } from "expo-file-system";
import { BASEDIR_PATH } from "./FileConfig";

export async function expoRead(path: string): Promise<string> {
  const file = new File(BASEDIR_PATH, path);
  if (!file.exists) throw new Error(`File not found: ${file.uri}`);
  return await file.text();
}

// atomicロジックではない単純書き込み
function logicWrite(path: string, data: string) {
  const file = new File(BASEDIR_PATH, path);
  file.parentDirectory.create({ intermediates: true, idempotent: true });
  if (!data) console.error("WriteError: Data Not Found");

  file.write(data);
}

export function expoWrite(path: string, data: string): void {
  const tmpPath = `${path}.tmp`;

  // 古いtmpファイルの削除
  if (expoExists(tmpPath)) {
    expoRemove(tmpPath);
  }

  // 1. tmpファイルへ書き込み
  logicWrite(tmpPath, data);

  // 2. 本体があれば削除
  if (expoExists(path)) {
    expoRemove(path);
  }

  expoMove(tmpPath, path);
}

export function expoMove(from: string, to: string): void {
  const fromFile = new File(BASEDIR_PATH, from);
  const toFile = new File(BASEDIR_PATH, to);

  // 移動先のディレクトリを保証
  toFile.parentDirectory.create({ intermediates: true, idempotent: true });

  // 移動先にすでに存在する場合削除
  if (toFile.exists) {
    toFile.delete();
  }

  fromFile.move(toFile);
}

export function expoRemove(path: string): void {
  const file = new File(BASEDIR_PATH, path);
  if (file.exists) file.delete();
}

export function expoExists(path: string): boolean {
  const file = new File(BASEDIR_PATH, path);
  return file.exists;
}
