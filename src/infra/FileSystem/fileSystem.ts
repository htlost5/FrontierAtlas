import { File } from "expo-file-system";
import { BASEDIR_PATH } from "./FileConfig";
import expoWalk from "./walk";

export async function expoRead(path: string): Promise<string> {
  const file = new File(BASEDIR_PATH, path);
  if (!file.exists) throw new Error(`File not found: ${file.uri}`);
  return await file.text();
}

export function expoWrite(path: string, data: string) {
  try {
    const file = new File(BASEDIR_PATH, path);
    file.parentDirectory.create({ intermediates: true, idempotent: true });
    if (!data) {
      throw new Error("Data not found!!");
    }

    file.write(data);
  } catch (e) {
    throw new Error(`[WriteError]: ${e}`);
  }
}

export function atomicWrite(path: string, data: string) {
  const tmpPath = `${path}.tmp`;
  expoWrite(tmpPath, data);
  expoMove(tmpPath, path);
}

export function expoMove(from: string, to: string): void {
  try {
    const fromFile = new File(BASEDIR_PATH, from);
    const toFile = new File(BASEDIR_PATH, to);

    // 移動先のディレクトリを保証
    toFile.parentDirectory.create({ intermediates: true, idempotent: true });

    // 移動先にすでに存在する場合削除
    if (toFile.exists) {
      toFile.delete();
    }

    fromFile.move(toFile);
  } catch (e) {
    throw new Error(`[moveError]: ${e}`);
  }
}

export function expoExists(path: string): boolean {
  const file = new File(BASEDIR_PATH, path);
  return file.exists;
}

export function expoSize(path: string): number {
  try {
    const file = new File(BASEDIR_PATH, path);
    return file.size;
  } catch (e) {
    throw new Error(`[sizecheckError]: ${e}`);
  }
}

export function expoRemove(path: string): void {
  try {
    const file = new File(BASEDIR_PATH, path);
    if (file.exists) file.delete();
  } catch (e) {
    throw new Error(`[removeError]: ${e}`);
  }
}

export function expoAllRemove(path: string, ext?: string) {
  const fileList = expoWalk(path, ext);

  for (const filePath of fileList) {
    expoRemove(filePath);
  }
}
