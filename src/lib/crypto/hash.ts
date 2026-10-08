import { keccak256, stringToHex } from "viem";

/**
 * Calculates SHA-256 digest of an ArrayBuffer or Uint8Array in the browser or server.
 * Returns a 0x-prefixed 32-byte hex string suitable for Solidity bytes32.
 */
export async function calculateSha256(data: ArrayBuffer | Uint8Array): Promise<`0x${string}`> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", bytes.buffer as ArrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexString = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return `0x${hexString}` as `0x${string}`;
  } else {
    const crypto = await import("crypto");
    const hash = crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");
    return `0x${hash}` as `0x${string}`;
  }
}

/**
 * Converts a batch code (e.g. "HNY-2026-0001") into an immutable bytes32 hash for Solidity.
 */
export function batchCodeToBytes32(batchCode: string): `0x${string}` {
  return keccak256(stringToHex(batchCode));
}

/**
 * Formats a short display version of an Ethereum address or hash (e.g. 0x1234...5678).
 */
export function formatShortHash(hash: string | null | undefined, chars: number = 4): string {
  if (!hash) return "";
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}
