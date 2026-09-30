import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL or SUPABASE_DB_URL in goa-heritage/.env before seeding.");
  process.exitCode = 1;
} else {
  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    max: 1,
    connectionTimeoutMillis: 5_000,
  });
  try {
    const schemaPath = resolve(fileURLToPath(new URL("../db/schema.sql", import.meta.url)));
    await pool.query(await readFile(schemaPath, "utf8"));
    const { rows } = await pool.query(
      "SELECT count(*)::int AS total FROM experiences WHERE status = 'published'",
    );
    console.log(`Database schema is ready. Published stories: ${rows[0].total}.`);
  } finally {
    await pool.end();
  }
}
