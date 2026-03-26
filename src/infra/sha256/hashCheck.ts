import { sha256 as noblesha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes, bytesToHex } from "@noble/hashes/utils.js";

export function sha256(data: string): string {
  const bytes = utf8ToBytes(data);
  const hash = noblesha256(bytes);
  return bytesToHex(hash);
}