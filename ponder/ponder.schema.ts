import { onchainTable } from "@ponder/core";

export const indexedBatches = onchainTable("indexed_batches", (p) => ({
  id: p.hex().primaryKey(), // batchId
  beekeeper: p.hex(),
  initialWeightGrams: p.integer(),
  metadataHash: p.hex(),
  status: p.text(),
  isRecalled: p.boolean(),
  createdAt: p.bigint(),
  blockNumber: p.bigint(),
}));

export const indexedLabTests = onchainTable("indexed_lab_tests", (p) => ({
  id: p.text().primaryKey(), // batchId-docHash
  batchId: p.hex(),
  labAddress: p.hex(),
  documentHash: p.hex(),
  passed: p.boolean(),
  testType: p.text(),
  timestamp: p.bigint(),
}));

export const indexedRecalls = onchainTable("indexed_recalls", (p) => ({
  id: p.text().primaryKey(), // batchId-timestamp
  batchId: p.hex(),
  recalledBy: p.hex(),
  reason: p.text(),
  timestamp: p.bigint(),
}));
