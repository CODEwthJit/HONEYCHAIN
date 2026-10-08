import { ponder } from "@/generated";
import { indexedBatches, indexedLabTests, indexedRecalls } from "../ponder.schema";

ponder.on("HoneyBatchRegistry:BatchCreated", async ({ event, context }) => {
  await context.db.insert(indexedBatches).values({
    id: event.args.batchId,
    beekeeper: event.args.beekeeper,
    initialWeightGrams: event.args.initialWeightGrams,
    metadataHash: event.args.metadataHash,
    status: "CREATED",
    isRecalled: false,
    createdAt: event.args.timestamp,
    blockNumber: event.block.number,
  });
});

ponder.on("HoneyBatchRegistry:LabTestRecorded", async ({ event, context }) => {
  await context.db.insert(indexedLabTests).values({
    id: `${event.args.batchId}-${event.args.documentHash}`,
    batchId: event.args.batchId,
    labAddress: event.args.labAddress,
    documentHash: event.args.documentHash,
    passed: event.args.passed,
    testType: event.args.testType,
    timestamp: event.args.timestamp,
  });

  await context.db
    .update(indexedBatches, { id: event.args.batchId })
    .set({ status: "TESTED" });
});

ponder.on("HoneyBatchRegistry:BatchRecalled", async ({ event, context }) => {
  await context.db.insert(indexedRecalls).values({
    id: `${event.args.batchId}-${event.args.timestamp}`,
    batchId: event.args.batchId,
    recalledBy: event.args.recalledBy,
    reason: event.args.reason,
    timestamp: event.args.timestamp,
  });

  await context.db
    .update(indexedBatches, { id: event.args.batchId })
    .set({ isRecalled: true, status: "RECALLED" });
});
