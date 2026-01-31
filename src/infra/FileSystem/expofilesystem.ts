import { File } from "expo-file-system";
import { BASEDIR_PATH } from "./FileConfig";

export async function expoRead(path: string): Promise<string> {
  const file = new File(BASEDIR_PATH, path);
  if (!file.exists) throw new Error(`File not found: ${file.uri}`);
  return await file.text();
}

// atomicロジックではない単純書き込み
export function expoWrite(path: string, data: string): void {
  const file = new File(BASEDIR_PATH, path);
  // 親ディレクトリ保証
  file.parentDirectory.create({ intermediates: true, idempotent: true });

  file.write(data);
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
