import { exists, move, remove, write } from "./expofilesystem";

async function atomicWrite(path: string, data: string) {
  const tmpPath = `${path}.tmp`;

  // 念の為、古い tmpファイル を削除
  if (await exists(tmpPath)) {
    await remove(tmpPath);
  }

  // 1. tmpファイルへ書き込み
  write(tmpPath, data);

  // 2. 本フォルダへ移動
  move(tmpPath, path);
}
