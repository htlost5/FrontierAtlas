import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { Buffer } from "buffer";

import { fileURLToPath } from "url";

const versionConfig = JSON.parse(
  fs.readFileSync(new URL("../config/geo-data-version.json", import.meta.url))
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { version } = versionConfig;

if (!version) {
  console.error("GetError: version情報を記載してください");
  process.exit(1);
}

const BASE_URL = "https://htlost5.github.io/geo-data-repo/releases";
const ZIP_URL = `${BASE_URL}/${version}/imdf-${version}.zip`;

const storagePath = path.join(__dirname, "../assets", "data")

async function resetDir() {
  if (fs.existsSync(storagePath)) {
    fs.rmSync(storagePath, {recursive: true, force: true});
    console.log(`[RESET] ${storagePath} deleted`);
  }
  fs.mkdirSync(storagePath, {recursive: true});
}

async function getData() {
  const response = await fetch(ZIP_URL);
  if (!response.ok) throw new Error(`Failed to fetch ${ZIP_URL}`);

  const buffer = Buffer.from(await response.arrayBuffer());

  // zip回答
  const directory = await unzipper.Open.buffer(buffer);
  await directory.extract({ path: storagePath, concurrency: 5 });

  console.log("Assets updated successfully");
}

async function main() {
  try {
    await resetDir();
    await getData();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

main()