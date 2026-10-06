// Runs pending database migrations before the build (e.g. on Vercel).
// Skips silently when no DATABASE_URL is configured.
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DATABASE_URL not set, skipping migrations");
  process.exit(0);
}
const pool = new pg.Pool({ connectionString: url, max: 1, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: true } });
await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
await pool.end();
console.log("[migrate] database is up to date");
