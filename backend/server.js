import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import db, { initDb } from "./db.js";

dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "change_me";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const uploadsDir = path.resolve("backend", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage });

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

initDb();

function now() {
  return new Date().toISOString();
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  return next();
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/upload", authRequired, adminOnly, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const hash = bcrypt.hashSync(password, 10);
  const createdAt = now();
  const userRole = role === "admin" ? "admin" : "user";

  const stmt = db.prepare(
    "INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?,?,?,?,?)"
  );
  stmt.run([name, email, hash, userRole, createdAt], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, name, email, role: userRole });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err || !row) return res.status(401).json({ error: "Invalid credentials" });
    const ok = bcrypt.compareSync(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken(row);
    res.json({ token, user: { id: row.id, name: row.name, email: row.email, role: row.role } });
  });
});

app.get("/api/institutions", (req, res) => {
  db.all("SELECT * FROM institutions ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/institutions/:id", (req, res) => {
  const id = Number(req.params.id);
  db.get("SELECT * FROM institutions WHERE id = ?", [id], (err, inst) => {
    if (err || !inst) return res.status(404).json({ error: "Not found" });
    db.all("SELECT * FROM gallery_images WHERE institution_id = ?", [id], (gerr, gallery) => {
      if (gerr) return res.status(500).json({ error: gerr.message });
      db.all("SELECT * FROM programs WHERE institution_id = ?", [id], (perr, programs) => {
        if (perr) return res.status(500).json({ error: perr.message });
        res.json({ ...inst, gallery, programs });
      });
    });
  });
});

app.post("/api/institutions", authRequired, adminOnly, (req, res) => {
  const { name, handle, city, country, address, contact, whatsapp, logo_url } = req.body || {};
  if (!name) return res.status(400).json({ error: "Name required" });
  const stmt = db.prepare(
    "INSERT INTO institutions (name, handle, city, country, address, contact, whatsapp, logo_url, created_at) VALUES (?,?,?,?,?,?,?,?,?)"
  );
  stmt.run([name, handle, city, country, address, contact, whatsapp, logo_url, now()], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put("/api/institutions/:id", authRequired, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  const { name, handle, city, country, address, contact, whatsapp, logo_url } = req.body || {};
  db.run(
    "UPDATE institutions SET name=?, handle=?, city=?, country=?, address=?, contact=?, whatsapp=?, logo_url=? WHERE id=?",
    [name, handle, city, country, address, contact, whatsapp, logo_url, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ ok: this.changes > 0 });
    }
  );
});

app.delete("/api/institutions/:id", authRequired, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  db.run("DELETE FROM institutions WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ ok: this.changes > 0 });
  });
});

app.get("/api/programs", (req, res) => {
  db.all("SELECT * FROM programs ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/programs", authRequired, adminOnly, (req, res) => {
  const {
    institution_id,
    field,
    degree,
    duration,
    intake,
    title,
    summary,
    tuition,
    mode,
    admission,
    highlights,
    outcomes,
    image_url,
  } = req.body || {};

  if (!institution_id || !title) return res.status(400).json({ error: "Missing fields" });
  const stmt = db.prepare(
    "INSERT INTO programs (institution_id, field, degree, duration, intake, title, summary, tuition, mode, admission, highlights, outcomes, image_url, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
  );
  stmt.run(
    [
      institution_id,
      field,
      degree,
      duration,
      intake,
      title,
      summary,
      tuition,
      mode,
      admission,
      JSON.stringify(highlights || []),
      JSON.stringify(outcomes || []),
      image_url,
      now(),
    ],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put("/api/programs/:id", authRequired, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  const {
    institution_id,
    field,
    degree,
    duration,
    intake,
    title,
    summary,
    tuition,
    mode,
    admission,
    highlights,
    outcomes,
    image_url,
  } = req.body || {};
  db.run(
    "UPDATE programs SET institution_id=?, field=?, degree=?, duration=?, intake=?, title=?, summary=?, tuition=?, mode=?, admission=?, highlights=?, outcomes=?, image_url=? WHERE id=?",
    [
      institution_id,
      field,
      degree,
      duration,
      intake,
      title,
      summary,
      tuition,
      mode,
      admission,
      JSON.stringify(highlights || []),
      JSON.stringify(outcomes || []),
      image_url,
      id,
    ],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ ok: this.changes > 0 });
    }
  );
});

app.delete("/api/programs/:id", authRequired, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  db.run("DELETE FROM programs WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ ok: this.changes > 0 });
  });
});

app.post("/api/institutions/:id/gallery", authRequired, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  const { image_url } = req.body || {};
  if (!image_url) return res.status(400).json({ error: "image_url required" });
  const stmt = db.prepare(
    "INSERT INTO gallery_images (institution_id, image_url, created_at) VALUES (?,?,?)"
  );
  stmt.run([id, image_url, now()], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.delete("/api/institutions/:id/gallery/:imageId", authRequired, adminOnly, (req, res) => {
  const imageId = Number(req.params.imageId);
  db.run("DELETE FROM gallery_images WHERE id = ?", [imageId], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ ok: this.changes > 0 });
  });
});

app.listen(PORT, () => {
  console.log(`Studysia backend running on http://localhost:${PORT}`);
});
