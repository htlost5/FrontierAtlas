#!/usr/bin/env ts-node
/**
 * rename-geojson-to-json.ts
 *
 * - 対象ディレクトリを固定:
 *   D:\htlost5_projects\FrontierAtlas\assets\imdf
 * - 再帰的に .geojson を探して .json にリネームする
 * - 既に target (.json) が存在する場合はスキップ（安全動作）
 *
 * 実行:
 *   npx ts-node rename-geojson-to-json.ts
 *
 * 注意:
 * - リネーム後にソース内の import パス（*.geojson -> *.json）を必ず置換してください
 */

import { promises as fs } from "fs";
import * as path from "path";

const targetDir = path.resolve("D:/htlost5_projects/FrontierAtlas/assets/imdf"); // ← 固定（Windows向け）
const skipIfTargetExists = true; // true: 既存 .json があればスキップ。上書きしたければ false に変更。

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

export async function renameGeojsonToJson() {
  try {
    const stat = await fs.stat(targetDir);
    if (!stat.isDirectory()) {
      console.error(`[ERROR] target is not a directory: ${targetDir}`);
      process.exit(2);
    }
  } catch (e) {
    console.error(`[ERROR] target directory not found: ${targetDir}`, e);
    process.exit(2);
  }

  let found = 0;
  let renamed = 0;

  for await (const filePath of walk(targetDir)) {
    if (/\.geojson$/i.test(filePath)) {
      found++;
      const rel = path.relative(targetDir, filePath);
      const targetPath = filePath.replace(/\.geojson$/i, ".json");

      // target の存在チェック
      let targetExists = false;
      try {
        await fs.access(targetPath);
        targetExists = true;
      } catch {
        targetExists = false;
      }

      if (targetExists && skipIfTargetExists) {
        console.warn(
          `[SKIP] target exists: ${path.relative(targetDir, targetPath)}`,
        );
        continue;
      }

      // リネーム実行
      try {
        if (targetExists && !skipIfTargetExists) {
          await fs.unlink(targetPath);
        }
        await fs.rename(filePath, targetPath);
        console.log(
          `[RENAMED] ${rel} -> ${path.relative(targetDir, targetPath)}`,
        );
        renamed++;
      } catch (err: any) {
        console.error(
          `[ERROR] failed to rename ${rel}: ${err?.message ?? err}`,
        );
      }
    }
  }

  console.log(`\nSummary: found=${found}, renamed=${renamed}`);
  if (found === 0)
    console.log("Note: .geojson files not found under target dir.");
}
