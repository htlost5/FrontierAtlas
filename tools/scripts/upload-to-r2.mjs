#!/usr/bin/env node
/**
 * upload-to-r2.mjs
 *
 * R2 完全アップロードスクリプト。
 * リリースディレクトリの全ファイル + meta/latest.json を R2 にアップロードする。
 *
 * Usage:
 *   node tools/scripts/upload-to-r2.mjs v1.0.0
 *
 * Prerequisites:
 *   - wrangler CLI がインストール済み
 *   - `wrangler whoami` で認証済み
 *   - カレントディレクトリがプロジェクトルート (wrangler.toml のある場所)
 */

import { execSync } from "child_process";
import { readdirSync, statSync, existsSync } from "fs";
import { join, relative, sep } from "path";
import { fileURLToPath } from "url";

// --- Config ----------------------------------------------------------
const BUCKET = "geo-data-frontieratlas";
const META_DIR = "tools/map-assets/meta";
const RELEASES_DIR = "tools/map-assets/releases";
const WRANGLER_CONFIG = "wrangler.toml"; // プロジェクトルートにある

// --- Helpers ---------------------------------------------------------

/**
 * ディレクトリを再帰的に走査し、ファイルの絶対パス一覧を返す
 */
function walkDir(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * 絶対パスからベースディレクトリを基準にした相対パスを POSIX 形式で返す
 */
function toPosixRelative(absolutePath, baseDir) {
  return relative(baseDir, absolutePath).split(sep).join("/");
}

/**
 * wrangler r2 object put を実行
 * @returns {{ ok: boolean, output: string }}
 */
function uploadFile(r2Key, localPath, contentType) {
  const r2Path = `${BUCKET}/${r2Key}`;
  const cmd = `npx wrangler r2 object put "${r2Path}" --file="${localPath}" --content-type="${contentType}" --remote --config "${WRANGLER_CONFIG}"`;
  try {
    const output = execSync(cmd, {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 120_000, // 2分タイムアウト
    });
    return { ok: true, output: output.trim() };
  } catch (e) {
    return {
      ok: false,
      output: (e.stderr || e.message || String(e)).trim(),
    };
  }
}

/**
 * ファイルの Content-Type を推定
 */
function detectContentType(filePath) {
  if (filePath.endsWith(".zip")) return "application/zip";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

// --- Main ------------------------------------------------------------

function main() {
  const version = process.argv[2];
  if (!version) {
    console.error("Usage: node tools/scripts/upload-to-r2.mjs <version>");
    console.error("Example: node tools/scripts/upload-to-r2.mjs v1.0.0");
    process.exit(1);
  }

  // Validate version format
  if (!/^v\d+\.\d+\.\d+$/.test(version)) {
    console.error(
      `Error: Invalid version format "${version}". Expected format: v1.0.0`,
    );
    process.exit(1);
  }

  const cwd = process.cwd();
  const releaseDir = join(cwd, RELEASES_DIR, version);
  if (!existsSync(releaseDir)) {
    console.error(`Error: Release directory not found: ${releaseDir}`);
    process.exit(1);
  }

  const metaDir = join(cwd, META_DIR);
  const latestJsonPath = join(metaDir, "latest.json");
  if (!existsSync(latestJsonPath)) {
    console.error(`Error: meta/latest.json not found: ${latestJsonPath}`);
    process.exit(1);
  }

  // Step 1: Collect all files from releases/{version}/
  const releaseFiles = walkDir(releaseDir);
  // Sort for deterministic order
  releaseFiles.sort();

  // Step 2: Build upload plan
  const uploadPlan = [];

  // a) Files under releases/{version}/ (data/ and zip)
  // R2 key includes "releases/" prefix to match Worker proxy path
  // Worker: /data/releases/v1.0.0/data/manifest.json → key = releases/v1.0.0/data/manifest.json
  for (const filePath of releaseFiles) {
    const relPath = toPosixRelative(filePath, join(cwd, RELEASES_DIR));
    const r2Key = `releases/${relPath}`; // e.g. "releases/v1.0.0/data/manifest.json"
    const contentType = detectContentType(filePath);
    uploadPlan.push({ r2Key, localPath: filePath, contentType });
  }

  // e) meta/latest.json
  uploadPlan.push({
    r2Key: "meta/latest.json",
    localPath: latestJsonPath,
    contentType: "application/json; charset=utf-8",
  });

  // Step 3: Execute uploads
  const total = uploadPlan.length;
  const results = [];

  console.log(`\nUploading ${total} files to R2 bucket "${BUCKET}"...\n`);

  for (let i = 0; i < total; i++) {
    const { r2Key, localPath, contentType } = uploadPlan[i];
    process.stdout.write(`[${i + 1}/${total}] ${r2Key} ... `);

    const { ok, output } = uploadFile(r2Key, localPath, contentType);

    if (ok) {
      console.log("OK");
      results.push({ r2Key, status: "ok" });
    } else {
      console.log("FAILED");
      console.error(`  Error: ${output}`);
      results.push({ r2Key, status: "failed", error: output });
    }
  }

  // Step 4: Summary
  console.log("\n=== Upload Summary ===");
  const successCount = results.filter((r) => r.status === "ok").length;
  const failCount = results.filter((r) => r.status === "failed").length;

  console.log(`  Total:   ${total}`);
  console.log(`  OK:      ${successCount}`);
  console.log(`  Failed:  ${failCount}`);

  if (failCount > 0) {
    console.log("\n  Failed files:");
    for (const r of results.filter((r) => r.status === "failed")) {
      console.log(`    - ${r.r2Key}`);
    }
  }

  console.log("");

  // Exit with non-zero if any failure
  if (failCount > 0) process.exit(1);
}

main();
