// fileSystem のインフラ層実装を提供する。
import { File } from "expo-file-system";
import { BASEDIR_PATH } from "./FileConfig";

export async function expoRead(path: string): Promise<string> {
  const file = new File(BASEDIR_PATH, path);
  if (!file.exists) throw new Error(`File not found: ${file.uri}`);
  return await file.text();
}
