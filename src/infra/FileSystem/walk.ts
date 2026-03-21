// パスと拡張子を受け取る
// パス内をファイル探索し、リストにBASE_DIRからの相対パスを追加
// （拡張子の指定があればそれに限定）

import { Directory, File } from "expo-file-system";
import { BASEDIR_PATH } from "./FileConfig";

// ルートディレクトリのすべてのフォルダ、ファイルを列挙
// それぞれが、ファイルであるか、フォルダであるかを確認
// ファイルの場合、その相対パスをリストに追加
// フォルダの場合、そのパスにexpoWalk処理

export default function expoWalk(path: string, ext?: string): string[] {
  const results: string[] = [];
  const rootDir = new Directory(BASEDIR_PATH, path);

  const normalizedExt = ext?.replace(/^\./, "");

  function walk(dir: Directory, currentPath: string) {
    for (const item of dir.list()) {
        const nextPath = currentPath
        ? `${currentPath}/${item.name}`
        : item.name;

      if (item instanceof Directory) {
        walk(item, nextPath);
      } else if (item instanceof File) {
        if (!normalizedExt || item.extension === normalizedExt) {
          results.push(nextPath);
        }
      }
    }
  }

  walk(rootDir, "");
  return results;
}
