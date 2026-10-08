import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/honeychain";

// For queries in server actions and route handlers
// Set max: 1 for serverless/edge connection pooling safety on Supabase free tier
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // necessary for Supabase transaction pooler (port 6543)
});

export const db = drizzle(client, { schema });

export * from "./schema";

