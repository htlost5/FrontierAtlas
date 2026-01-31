import { expoExists, expoMove, expoRemove, expoWrite } from "./expofilesystem";

export function atomicWrite(path: string, data: string) {
  const tmpPath = `${path}.tmp`;

  // 念の為、古い tmpファイル を削除
  if (expoExists(tmpPath)) {
    expoRemove(tmpPath);
  }

  // 1. tmpファイルへ書き込み
  expoWrite(tmpPath, data);

  // 2. 本体があれば削除
  if (expoExists(path)) {
    expoRemove(path);
  }

  // 3. 本フォルダへ移動
  expoMove(tmpPath, path);
}

// path指定例
// settings/config.json
