import * as FileSystem from "expo-file-system";

async function expoRead(path: string): Promise<string> {
  return FileSystem.readAsStringAsync(path);
}

// atomicロジックではない単純書き込み
async function expoWrite(path: string, data: string): Promise<void> {
  await FileSystem.writeAsStringAsync(path, data);
}

async function expoMove(from: string, to: string): Promise<void> {
  await FileSystem.moveAsync({ from: from, to: to });
}

async function expoRemove(path: string): Promise<void> {
  await FileSystem.deleteAsync(path, { idempotent: true });
}

async function expoExists(path: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(path);
  return info.exists;
}

export { expoExists, expoMove, expoRead, expoRemove, expoWrite };

