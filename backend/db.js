import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "studysia.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new sqlite3.Database(dbPath);

export function initDb() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TEXT NOT NULL
      )`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS institutions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        handle TEXT,
        city TEXT,
        country TEXT,
        address TEXT,
        contact TEXT,
        whatsapp TEXT,
        logo_url TEXT,
        created_at TEXT NOT NULL
      )`
    );
    db.run(
      "ALTER TABLE institutions ADD COLUMN active_etablissement INTEGER NOT NULL DEFAULT 1",
      () => {}
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        institution_id INTEGER NOT NULL,
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
        created_at TEXT NOT NULL,
        FOREIGN KEY (institution_id) REFERENCES institutions(id)
      )`
    );
    db.run(
      "ALTER TABLE programs ADD COLUMN active_formation INTEGER NOT NULL DEFAULT 1",
      () => {}
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS gallery_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        institution_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (institution_id) REFERENCES institutions(id)
      )`
    );
  });
}

export default db;
