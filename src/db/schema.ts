import { pgTable, text, timestamp, boolean, integer, numeric, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. ORGANIZATIONS
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  orgType: text("org_type").notNull(), // 'BEEKEEPER' | 'LABORATORY' | 'PROCESSOR' | 'PACKAGER' | 'DISTRIBUTOR' | 'ADMIN'
  walletAddress: text("wallet_address").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  contactEmail: text("contact_email"),
  physicalAddress: text("physical_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. USERS
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // matches Supabase auth.users.id
  email: text("email").notNull().unique(),
  orgId: uuid("org_id").references(() => organizations.id),
  fullName: text("full_name"),
  role: text("role").notNull(), // 'ADMIN' | 'BEEKEEPER' | 'LABORATORY' | 'PROCESSOR' | 'PACKAGER' | 'DISTRIBUTOR'
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. HONEY BATCHES
export const honeyBatches = pgTable("honey_batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchCode: text("batch_code").notNull().unique(), // e.g. HNY-2026-0001
  onChainBatchId: text("on_chain_batch_id").unique(), // bytes32 hex string
  createdByOrgId: uuid("created_by_org_id").references(() => organizations.id).notNull(),
  botanicalOrigin: text("botanical_origin").notNull(), // e.g. Wildflower, Acacia, Eucalyptus
  harvestRegion: text("harvest_region").notNull(), // e.g. Nilgiris Hills, Western Ghats
  harvestDate: timestamp("harvest_date", { withTimezone: true }).notNull(),
  initialWeightGrams: integer("initial_weight_grams").notNull(),
  currentWeightGrams: integer("current_weight_grams").notNull(),
  status: text("status").default("CREATED").notNull(), // 'CREATED' | 'TESTED' | 'PROCESSED' | 'PACKAGED' | 'IN_TRANSIT' | 'DELIVERED' | 'RECALLED'
  onChainStatus: text("on_chain_status").default("LOCAL_ONLY").notNull(), // 'LOCAL_ONLY' | 'PENDING_ON_CHAIN' | 'CONFIRMED_ON_CHAIN' | 'FAILED'
  txHash: text("tx_hash"),
  blockNumber: integer("block_number"),
  isRecalled: boolean("is_recalled").default(false).notNull(),
  recallReason: text("recall_reason"),
  recalledAt: timestamp("recalled_at", { withTimezone: true }),
  recalledBy: text("recalled_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. BATCH LINEAGE (Directed Acyclic Graph for batch splits & blends)
export const batchLineage = pgTable("batch_lineage", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentBatchId: uuid("parent_batch_id").references(() => honeyBatches.id).notNull(),
  childBatchId: uuid("child_batch_id").references(() => honeyBatches.id).notNull(),
  quantityContributedGrams: integer("quantity_contributed_grams").notNull(),
  transformationType: text("transformation_type").notNull(), // 'SPLIT' | 'MERGE' | 'FILTER'
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 5. DOCUMENTS (Stored in Supabase Storage, hash anchored on-chain)
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  fileName: text("file_name").notNull(),
  storagePath: text("storage_path").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  sha256Hash: text("sha256_hash").notNull().unique(), // 0x... hex digest
  onChainTxHash: text("on_chain_tx_hash"),
  uploadedByOrgId: uuid("uploaded_by_org_id").references(() => organizations.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 6. LAB TESTS
export const labTests = pgTable("lab_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => honeyBatches.id).notNull(),
  labOrgId: uuid("lab_org_id").references(() => organizations.id).notNull(),
  moisturePercentage: numeric("moisture_percentage", { precision: 5, scale: 2 }).notNull(), // Standard: < 20%
  hmfMgPerKg: numeric("hmf_mg_per_kg", { precision: 6, scale: 2 }).notNull(), // Standard: < 40 mg/kg
  c4SugarsPassed: boolean("c4_sugars_passed").notNull(), // Isotope test: true if negative for adulterant syrup
  pollenProfile: text("pollen_profile"), // e.g. "Wild Acacia 78%, Clover 14%"
  antibioticsDetected: boolean("antibiotics_detected").default(false).notNull(),
  overallPass: boolean("overall_pass").notNull(),
  documentId: uuid("document_id").references(() => documents.id),
  onChainDocHash: text("on_chain_doc_hash"),
  isVerified: boolean("is_verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  testDate: timestamp("test_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 7. PROCESSING RECORDS
export const processingRecords = pgTable("processing_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => honeyBatches.id).notNull(),
  processorOrgId: uuid("processor_org_id").references(() => organizations.id).notNull(),
  facilityName: text("facility_name").notNull(),
  filtrationType: text("filtration_type"), // e.g. "Coarse strained, non-ultrafiltered"
  maxTemperatureCelsius: numeric("max_temperature_celsius", { precision: 5, scale: 2 }), // Raw honey verification (< 45°C)
  processingDate: timestamp("processing_date", { withTimezone: true }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. PACKAGING LOTS
export const packagingLots = pgTable("packaging_lots", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => honeyBatches.id).notNull(),
  packagerOrgId: uuid("packager_org_id").references(() => organizations.id).notNull(),
  lotNumber: text("lot_number").notNull().unique(), // e.g. LOT-PKG-2026-9042
  unitVolumeMl: integer("unit_volume_ml").notNull(), // e.g. 500
  unitCount: integer("unit_count").notNull(), // e.g. 1000
  packagingDate: timestamp("packaging_date", { withTimezone: true }).notNull(),
  bestBeforeDate: timestamp("best_before_date", { withTimezone: true }).notNull(),
  qrToken: text("qr_token").notNull().unique(), // Token embedded in QR code URL
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 9. SHIPMENTS
export const shipments = pgTable("shipments", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => honeyBatches.id).notNull(),
  distributorOrgId: uuid("distributor_org_id").references(() => organizations.id).notNull(),
  trackingNumber: text("tracking_number").notNull(),
  originLocation: text("origin_location").notNull(),
  destinationLocation: text("destination_location").notNull(),
  status: text("status").notNull(), // 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED'
  temperatureControlled: boolean("temperature_controlled").default(true).notNull(),
  dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 10. BATCH EVENTS (Unified Audit Trail for UI timeline)
export const batchEvents = pgTable("batch_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => honeyBatches.id).notNull(),
  eventType: text("event_type").notNull(), // 'BATCH_CREATED' | 'LAB_TESTED' | 'PROCESSED' | 'PACKAGED' | 'SHIPPED' | 'RECALLED'
  actorWallet: text("actor_wallet").notNull(),
  actorName: text("actor_name").notNull(),
  location: text("location"),
  description: text("description").notNull(),
  metadataJson: text("metadata_json"), // JSON string with specific metrics
  txHash: text("tx_hash"),
  blockNumber: integer("block_number"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

// 11. BLOCKCHAIN TRANSACTIONS
export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  txHash: text("tx_hash").notNull().unique(),
  contractAddress: text("contract_address").notNull(),
  functionName: text("function_name").notNull(),
  batchId: uuid("batch_id").references(() => honeyBatches.id),
  status: text("status").default("PENDING").notNull(), // 'PENDING' | 'CONFIRMED' | 'REVERTED'
  blockNumber: integer("block_number"),
  gasUsed: text("gas_used"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
});

// 12. RECALLS
export const recalls = pgTable("recalls", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").references(() => honeyBatches.id).notNull(),
  initiatedBy: text("initiated_by").notNull(),
  reason: text("reason").notNull(),
  severity: text("severity").default("CRITICAL").notNull(), // 'CRITICAL' | 'HIGH' | 'MEDIUM'
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// RELATIONS DEFINITIONS
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  batches: many(honeyBatches),
  labTests: many(labTests),
}));

export const honeyBatchesRelations = relations(honeyBatches, ({ one, many }) => ({
  createdBy: one(organizations, {
    fields: [honeyBatches.createdByOrgId],
    references: [organizations.id],
  }),
  parentRelations: many(batchLineage, { relationName: "parentLineage" }),
  childRelations: many(batchLineage, { relationName: "childLineage" }),
  labTests: many(labTests),
  processingRecords: many(processingRecords),
  packagingLots: many(packagingLots),
  shipments: many(shipments),
  events: many(batchEvents),
  recalls: many(recalls),
}));

export const batchLineageRelations = relations(batchLineage, ({ one }) => ({
  parentBatch: one(honeyBatches, {
    fields: [batchLineage.parentBatchId],
    references: [honeyBatches.id],
    relationName: "parentLineage",
  }),
  childBatch: one(honeyBatches, {
    fields: [batchLineage.childBatchId],
    references: [honeyBatches.id],
    relationName: "childLineage",
  }),
}));

export const labTestsRelations = relations(labTests, ({ one }) => ({
  batch: one(honeyBatches, {
    fields: [labTests.batchId],
    references: [honeyBatches.id],
  }),
  labOrg: one(organizations, {
    fields: [labTests.labOrgId],
    references: [organizations.id],
  }),
  document: one(documents, {
    fields: [labTests.documentId],
    references: [documents.id],
  }),
}));

export const packagingLotsRelations = relations(packagingLots, ({ one }) => ({
  batch: one(honeyBatches, {
    fields: [packagingLots.batchId],
    references: [honeyBatches.id],
  }),
  packagerOrg: one(organizations, {
    fields: [packagingLots.packagerOrgId],
    references: [organizations.id],
  }),
}));

