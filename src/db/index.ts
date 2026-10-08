import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  var __wnPool: Pool | undefined;
}

let _db: NodePgDatabase<typeof schema> | undefined;

export function hasDb() {
  return Boolean(process.env.DATABASE_URL);
}

/** Lazily created so builds without DATABASE_URL still work for the public site. */
export function db() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const pool =
    globalThis.__wnPool ??
    new Pool({
      connectionString: url,
      max: 10,
      ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: true },
    });
  if (process.env.NODE_ENV !== "production") globalThis.__wnPool = pool;
  _db = drizzle(pool, { schema });
  return _db;
}

export { schema };
