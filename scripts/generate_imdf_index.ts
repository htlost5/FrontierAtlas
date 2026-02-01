#!/usr/bin/env ts-node
/*
 generate_imdf_index.ts

 - POSIXパスに正規化
 - size は JSON.stringify(<parsed>) を一度テンポラリに書き出してから取得
   - Expo 環境であれば expo-file-system の writeAsStringAsync / getInfoAsync を使用
   - Node 環境ではローカルの ./tmp/... に書いて fs.stat でサイズ取得
 - buildManifest.json 自体は走査対象から除外

 使い方（例）:
   npx ts-node --transpile-only ./generate_imdf_index.ts
   npx ts-node --transpile-only ./generate_imdf_index.ts ./assets/imdf --out ./assets/imdf/buildManifest.json
   npx ts-node --transpile-only ./generate_imdf_index.ts --generatedBy htlost5 --language ja-JP --version 1.0.0

 注意:
 - Expo の API を使う場合はこのスクリプトを Expo 環境（実機や Expo Go）で実行する必要があります。
 - Node 実行時は代替のローカルファイル書き込み経由でサイズを取得します。

 References:
 - expo-file-system (writeAsStringAsync / getInfoAsync): https://docs.expo.dev/versions/latest/sdk/filesystem/ 
*/

import fs from "fs";
import path from "path";

const { promisify } = require("util");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

function toPosix(p: string) {
  return p.split(path.sep).join("/");
}

async function walkDir(
  root: string,
  excludeRelPaths: Set<string>,
): Promise<string[]> {
  const files: string[] = [];
  async function walk(cur: string) {
    const entries = await readdir(cur);
    for (const e of entries) {
      const full = path.join(cur, e);
      const s = await stat(full);
      if (s.isDirectory()) {
        await walk(full);
      } else if (s.isFile()) {
        const rel = toPosix(path.relative(root, full));
        if (excludeRelPaths.has(rel)) continue;
        files.push(full);
      }
    }
  }
  await walk(root);
  return files;
}

function genLogicalId(relativePosix: string) {
  const noExt = relativePosix.replace(/\.[^/.]+$/, "");
  let id = noExt.replace(/\//g, "__");
  id = id.replace(/[^a-zA-Z0-9_]/g, "_");
  id = id.replace(/_+/g, "_");
  id = id.replace(/^_+|_+$/g, "");
  return id.toLowerCase();
}

async function fileSha256(filePath: string) {
  return new Promise<string>((resolve, reject) => {
    const crypto = require("crypto");
    const hash = crypto.createHash("sha256");
    const rs = fs.createReadStream(filePath);
    rs.on("error", reject);
    rs.on("data", (chunk) => hash.update(chunk));
    rs.on("end", () => resolve(hash.digest("hex")));
  });
}

async function ensureDirFor(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
}

async function computeSizeViaNodeTmp(
  root: string,
  relPosix: string,
  contents: string,
) {
  const tmpPath = path.join(root, "tmp", relPosix + ".tmp");
  await ensureDirFor(tmpPath);
  await fs.promises.writeFile(tmpPath, contents, "utf8");
  const s = await stat(tmpPath);
  await fs.promises.unlink(tmpPath).catch(() => {});
  return s.size;
}

async function computeSizeViaExpoTmp(
  ExpoFS: any,
  relPosix: string,
  contents: string,
) {
  // Expo の場合は FileSystem.cacheDirectory または documentDirectory を使う
  const base = ExpoFS.cacheDirectory || ExpoFS.documentDirectory;
  if (!base)
    throw new Error("No FileSystem cache/document directory available");

  // tmpUri は posix 形式で作る
  const tmpUri = base + "imdf_tmp/" + relPosix;
  const dirUri = path.posix.dirname(tmpUri) + "/";

  // make directory（intermediates true）
  try {
    await ExpoFS.makeDirectoryAsync(dirUri, { intermediates: true });
  } catch (e) {
    // ignore if exists or platform doesn't support
  }

  // write
  await ExpoFS.writeAsStringAsync(tmpUri, contents, {
    encoding: ExpoFS.EncodingType.UTF8,
  });
  const info = await ExpoFS.getInfoAsync(tmpUri);
  // cleanup
  try {
    await ExpoFS.deleteAsync(tmpUri);
  } catch (e) {}
  return info.size || 0;
}

async function buildIndex(
  rootArg: string,
  options: {
    generatedBy: string;
    language: string;
    version: string;
    outFile?: string;
  },
) {
  // rootArg can be absolute or relative; script's base is __dirname
  const root = path.resolve(__dirname, rootArg);
  const rootPosix = toPosix(root);
  const relBuildManifest = "buildManifest.json";
  const exclude = new Set<string>([relBuildManifest]);

  // Try to dynamically import expo-file-system if available (uses import syntax)
  let ExpoFS: any = null;
  try {
    const mod = await import("expo-file-system");
    ExpoFS = mod && (mod as any).default ? (mod as any).default : mod;
    console.log(
      "expo-file-system detected: using Expo API for tmp size calculation.",
    );
  } catch (e) {
    ExpoFS = null;
    console.log(
      "expo-file-system not available: falling back to Node fs for tmp size calculation.",
    );
  }

  const files = await walkDir(root, exclude);

  const byLogicalId: Record<string, any> = {};
  const byRelativePath: Record<string, any> = {};

  for (const full of files) {
    const relative = path.relative(root, full);
    const relativePosix = toPosix(relative);
    const absolutePath = toPosix(path.resolve(full));
    const fileName = path.basename(full);
    const logicalIdBase = genLogicalId(relativePosix);

    // 同じ論理IDがある場合は _1, _2... を付与
    let logicalId = logicalIdBase;
    let counter = 1;
    while (byLogicalId[logicalId]) {
      logicalId = `${logicalIdBase}_${counter}`;
      counter += 1;
    }

    // 読み込み & canonical stringify
    const raw = await fs.promises.readFile(full, "utf8");
    let canonical = raw;
    try {
      const parsed = JSON.parse(raw);
      canonical = JSON.stringify(parsed);
    } catch (e) {
      // JSON parse error -> use raw string
      canonical = raw;
    }

    // size を取得（expo があれば Expo を使う）
    let size: number;
    if (ExpoFS) {
      try {
        size = await computeSizeViaExpoTmp(ExpoFS, relativePosix, canonical);
      } catch (e) {
        console.warn(
          "Expo size computation failed, falling back to node tmp:",
          e,
        );
        size = await computeSizeViaNodeTmp(root, relativePosix, canonical);
      }
    } else {
      size = await computeSizeViaNodeTmp(root, relativePosix, canonical);
    }

    // sha256 (from actual file bytes)
    const sha256 = await fileSha256(full);

    const entry = {
      logicalId,
      relativePath: relativePosix,
      absolutePath,
      fileName,
      size,
      sha256,
    };

    byLogicalId[logicalId] = entry;
    byRelativePath[relativePosix] = {
      logicalId,
      absolutePath,
      fileName,
      size,
      sha256,
    };
  }

  const out = {
    version: options.version,
    created: new Date().toISOString(),
    generated_by: options.generatedBy,
    language: options.language,
    generatedAt: Date.now(),
    root: rootPosix,
    count: Object.keys(byLogicalId).length,
    files: byLogicalId,
    byRelativePath,
  };

  const outPath = options.outFile || path.join(root, "buildManifest.json");
  await fs.promises.writeFile(outPath, JSON.stringify(out, null, 2), "utf8");
  return outPath;
}

async function main() {
  const argv = process.argv.slice(2);
  let rootArg = "../assets/imdf"; // relative to scripts dir
  let outArg: string | undefined;
  let genBy = "htlost5";
  let language = "ja-JP";
  let version = "1.0.0";

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--") && i === 0) {
      rootArg = a;
      continue;
    }
    if (a === "--out" && argv[i + 1]) {
      outArg = argv[i + 1];
      i++;
      continue;
    }
    if (a === "--generatedBy" && argv[i + 1]) {
      genBy = argv[i + 1];
      i++;
      continue;
    }
    if (a === "--language" && argv[i + 1]) {
      language = argv[i + 1];
      i++;
      continue;
    }
    if (a === "--version" && argv[i + 1]) {
      version = argv[i + 1];
      i++;
      continue;
    }
  }

  const root = path.resolve(__dirname, rootArg);
  try {
    const outPath = await buildIndex(rootArg, {
      generatedBy: genBy,
      language,
      version,
      outFile: outArg,
    });
    console.log("Wrote build manifest to", outPath);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
