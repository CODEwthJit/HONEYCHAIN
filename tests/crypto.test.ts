import { describe, it, expect } from "vitest";
import { calculateSha256, batchCodeToBytes32, formatShortHash } from "../src/lib/crypto/hash";

describe("HoneyChain Cryptographic Utilities", () => {
  it("should calculate deterministic SHA-256 hash for given bytes", async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode("Certificate of Analysis: 100% Pure Wild Honey");
    const hash = await calculateSha256(data);

    expect(hash).toMatch(/^0x[a-f0-9]{64}$/);

    // Identical data must produce identical hash
    const hashRepeat = await calculateSha256(data);
    expect(hashRepeat).toBe(hash);
  });

  it("should produce a completely divergent hash when a single byte is changed (Avalanche Effect)", async () => {
    const encoder = new TextEncoder();
    const originalDoc = encoder.encode("Moisture: 17.5%");
    const alteredDoc = encoder.encode("Moisture: 17.6%"); // 1 character difference

    const originalHash = await calculateSha256(originalDoc);
    const alteredHash = await calculateSha256(alteredDoc);

    expect(originalHash).not.toBe(alteredHash);
  });

  it("should convert batch code string to bytes32 keccak256 hash", () => {
    const code = "HNY-2026-0001";
    const bytes32 = batchCodeToBytes32(code);

    expect(bytes32).toMatch(/^0x[a-f0-9]{64}$/);
    expect(bytes32).toBe(batchCodeToBytes32(code));
  });

  it("should format short hash for UI display cleanly", () => {
    const fullHash = "0x8fae19b674823c91e0318ba8cd791192fa294be81132890a8fe5518b23c9811f";
    const short = formatShortHash(fullHash, 4);

    expect(short).toBe("0x8fae...811f");
    expect(formatShortHash("0x1234")).toBe("0x1234");
  });
});
