import { expoRemove } from "@/src/infra/FileSystem/expofilesystem";
import { OperateFile } from "../diff/types";
import { IMDF_BASE_DIR } from "../pathConfig";

export function removeFiles(removeList: OperateFile[]): void {
  removeList.forEach((f) => {
    const targetPath = IMDF_BASE_DIR + f.relativePath;
    expoRemove(targetPath);
  });
}
