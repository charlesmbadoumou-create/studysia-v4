import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

const ssl =
  process.env.PGSSL === "false"
    ? false
    : process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false;

const DATABASE_URL = process.env.DATABASE_URL;
const hasDiscretePgConfig =
  process.env.PGHOST &&
  process.env.PGPORT &&
  process.env.PGUSER &&
  process.env.PGPASSWORD &&
  process.env.PGDATABASE;

const poolConfig = { ssl };

if (DATABASE_URL) {
  try {
    new URL(DATABASE_URL);
    poolConfig.connectionString = DATABASE_URL;
  } catch {
    if (!hasDiscretePgConfig) {
      throw new Error("Invalid DATABASE_URL and missing PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE");
    }
  }
}

if (!poolConfig.connectionString) {
  if (!hasDiscretePgConfig) {
    throw new Error("DATABASE_URL or full PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE is required");
  }
  poolConfig.host = process.env.PGHOST;
  poolConfig.port = Number(process.env.PGPORT);
  poolConfig.user = process.env.PGUSER;
  poolConfig.password = process.env.PGPASSWORD;
  poolConfig.database = process.env.PGDATABASE;
}

const pool = new Pool(poolConfig);

function toPgSql(sql) {
  let text = String(sql).trim();

  // SQLite compatibility
  text = text.replace(/INSERT\s+OR\s+IGNORE\s+INTO/gi, "INSERT INTO");
  text = text.replace(
    /ALTER TABLE\s+(\w+)\s+ADD COLUMN\s+(\w+)\s+/gi,
    "ALTER TABLE $1 ADD COLUMN IF NOT EXISTS $2 "
  );
  text = text.replace(/AUTOINCREMENT/gi, "");
  text = text.replace(/INTEGER PRIMARY KEY/gi, "SERIAL PRIMARY KEY");
  text = text.replace(/\bTEXT\b/gi, "TEXT");

  // sqlite_sequence reset should be ignored on postgres
  if (/sqlite_sequence/i.test(text)) {
    return null;
  }

  return text;
}

function applyParams(sql, params = []) {
  let i = 0;
  return sql.replace(/\?/g, () => {
    i += 1;
    return `$${i}`;
  });
}

function maybeAppendReturning(sql) {
  const upper = sql.toUpperCase();
  if (upper.startsWith("INSERT") && !upper.includes(" RETURNING ")) {
    return `${sql} RETURNING id`;
  }
  return sql;
}

const db = {
  async query(sql, params = []) {
    const translated = toPgSql(sql);
    if (!translated) {
      return { rows: [], rowCount: 0 };
    }
    const withParams = applyParams(translated, params);
    return pool.query(withParams, params);
  },

  run(sql, params = [], callback = () => {}) {
    const translated = toPgSql(sql);
    if (!translated) {
      callback.call({ lastID: undefined, changes: 0 }, null);
      return;
    }
    const withParams = applyParams(maybeAppendReturning(translated), params);
    pool
      .query(withParams, params)
      .then((result) => {
        const lastID = result.rows?.[0]?.id;
        callback.call(
          { lastID, changes: result.rowCount || 0 },
          null
        );
      })
      .catch((err) => callback.call({ lastID: undefined, changes: 0 }, err));
  },

  get(sql, params = [], callback = () => {}) {
    const translated = toPgSql(sql);
    if (!translated) {
      callback(null, undefined);
      return;
    }
    const withParams = applyParams(translated, params);
    pool
      .query(withParams, params)
      .then((result) => callback(null, result.rows[0]))
      .catch((err) => callback(err));
  },

  all(sql, params = [], callback = () => {}) {
    const translated = toPgSql(sql);
    if (!translated) {
      callback(null, []);
      return;
    }
    const withParams = applyParams(translated, params);
    pool
      .query(withParams, params)
      .then((result) => callback(null, result.rows))
      .catch((err) => callback(err));
  },
};

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      institution_id INTEGER,
      created_at TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS institutions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT,
      city TEXT,
      country TEXT,
      address TEXT,
      contact TEXT,
      whatsapp TEXT,
      logo_url TEXT,
      active_etablissement INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  await pool.query(`
    ALTER TABLE institutions
    ADD COLUMN IF NOT EXISTS share_whatsapp TEXT;
  `);
  await pool.query(`
    ALTER TABLE institutions
    ADD COLUMN IF NOT EXISTS share_facebook TEXT;
  `);
  await pool.query(`
    ALTER TABLE institutions
    ADD COLUMN IF NOT EXISTS share_tiktok TEXT;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS programs (
      id SERIAL PRIMARY KEY,
      institution_id INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
      field TEXT,
      degree TEXT,
      duration TEXT,
      intake TEXT,
      title TEXT NOT NULL,
      summary TEXT,
      tuition TEXT,
      mode TEXT,
      admission TEXT,
      highlights TEXT,
      outcomes TEXT,
      image_url TEXT,
      active_formation INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id SERIAL PRIMARY KEY,
      institution_id INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

}

export async function closeDb() {
  await pool.end();
}

export default db;
