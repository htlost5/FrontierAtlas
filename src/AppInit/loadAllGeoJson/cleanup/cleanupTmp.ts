import { BASEDIR_PATH } from "@/src/infra/FileSystem/FileConfig";
import { Directory, File } from "expo-file-system";

async function removeTmpRecursive(dir: Directory): Promise<void> {
  const entries = dir.list();

  for (const entry of entries) {
    if (entry instanceof File) {
      if (entry.name.endsWith(".tmp")) {
        entry.delete();
      }
    } else {
      await removeTmpRecursive(entry);
    }
  }
}

export async function cleanupTmpFiles(): Promise<void> {
  const root = new Directory(BASEDIR_PATH);
  await removeTmpRecursive(root);
}
