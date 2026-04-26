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
  return jwt.sign(
    { id: user.id, role: user.role, institution_id: user.institution_id || null },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
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

function toActiveFlag(value, defaultValue = 1) {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value ? 1 : 0;
  const normalized = String(value).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "vrai" ? 1 : 0;
}

function includeInactive(req) {
  return req.query.include_inactive === "1";
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
  const { name, email, password, role, institution_id } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const hash = bcrypt.hashSync(password, 10);
  const createdAt = now();
  const normalizedRole = String(role || "").trim().toLowerCase();
  // Public registration cannot create admins.
  const userRole = normalizedRole === "institution" ? "institution" : "user";

  const linkedInstitutionId =
    userRole === "institution" && institution_id ? Number(institution_id) : null;
  const stmt = db.prepare(
    "INSERT INTO users (name, email, password_hash, role, institution_id, created_at) VALUES (?,?,?,?,?,?)"
  );
  stmt.run([name, email, hash, userRole, linkedInstitutionId, createdAt], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, name, email, role: userRole, institution_id: linkedInstitutionId });
  });
});

app.post("/api/admin/users", authRequired, adminOnly, (req, res) => {
  const { name, email, password, role, institution_id } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const normalizedRole = String(role || "").trim().toLowerCase();
  const allowedRoles = new Set(["user", "institution", "admin"]);
  const userRole = allowedRoles.has(normalizedRole) ? normalizedRole : "institution";
  const hash = bcrypt.hashSync(password, 10);
  const createdAt = now();

  const linkedInstitutionId =
    userRole === "institution" && institution_id ? Number(institution_id) : null;
  if (userRole === "institution" && !linkedInstitutionId) {
    return res.status(400).json({ error: "institution_id is required for institution accounts" });
  }
  const stmt = db.prepare(
    "INSERT INTO users (name, email, password_hash, role, institution_id, created_at) VALUES (?,?,?,?,?,?)"
  );
  stmt.run([name, email, hash, userRole, linkedInstitutionId, createdAt], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({
      id: this.lastID,
      name,
      email,
      role: userRole,
      institution_id: linkedInstitutionId,
    });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  db.get(
    `SELECT u.*, i.name AS institution_name
     FROM users u
     LEFT JOIN institutions i ON i.id = u.institution_id
     WHERE u.email = ?`,
    [email],
    (err, row) => {
    if (err || !row) return res.status(401).json({ error: "Invalid credentials" });
    const ok = bcrypt.compareSync(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken(row);
    res.json({
      token,
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        institution_id: row.institution_id || null,
        institution_name: row.institution_name || null,
      },
    });
  });
});

app.get("/api/institutions", (req, res) => {
  const query = includeInactive(req)
    ? "SELECT * FROM institutions ORDER BY id DESC"
    : "SELECT * FROM institutions WHERE active_etablissement = 1 ORDER BY id DESC";
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/institutions/:id", (req, res) => {
  const id = Number(req.params.id);
  const instQuery = includeInactive(req)
    ? "SELECT * FROM institutions WHERE id = ?"
    : "SELECT * FROM institutions WHERE id = ? AND active_etablissement = 1";
  db.get(instQuery, [id], (err, inst) => {
    if (err || !inst) return res.status(404).json({ error: "Not found" });
    db.all("SELECT * FROM gallery_images WHERE institution_id = ?", [id], (gerr, gallery) => {
      if (gerr) return res.status(500).json({ error: gerr.message });
      const programsQuery = includeInactive(req)
        ? "SELECT * FROM programs WHERE institution_id = ?"
        : "SELECT * FROM programs WHERE institution_id = ? AND active_formation = 1";
      db.all(programsQuery, [id], (perr, programs) => {
        if (perr) return res.status(500).json({ error: perr.message });
        res.json({ ...inst, gallery, programs });
      });
    });
  });
});

app.post("/api/institutions", authRequired, adminOnly, (req, res) => {
  const { name, handle, city, country, address, contact, whatsapp, logo_url, active_etablissement } = req.body || {};
  if (!name || !city || !country) {
    return res.status(400).json({ error: "Name, city and country are required" });
  }
  const stmt = db.prepare(
    "INSERT INTO institutions (name, handle, city, country, address, contact, whatsapp, logo_url, active_etablissement, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
  );
  stmt.run(
    [name, handle, city, country, address, contact, whatsapp, logo_url, toActiveFlag(active_etablissement, 1), now()],
    function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
    }
  );
});

app.put("/api/institutions/:id", authRequired, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  const { name, handle, city, country, address, contact, whatsapp, logo_url, active_etablissement } = req.body || {};
  if (!name || !city || !country) {
    return res.status(400).json({ error: "Name, city and country are required" });
  }
  db.run(
    "UPDATE institutions SET name=?, handle=?, city=?, country=?, address=?, contact=?, whatsapp=?, logo_url=?, active_etablissement=? WHERE id=?",
    [name, handle, city, country, address, contact, whatsapp, logo_url, toActiveFlag(active_etablissement, 1), id],
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
  const query = includeInactive(req)
    ? "SELECT * FROM programs ORDER BY id DESC"
    : `SELECT p.* 
       FROM programs p
       INNER JOIN institutions i ON i.id = p.institution_id
       WHERE p.active_formation = 1 AND i.active_etablissement = 1
       ORDER BY p.id DESC`;
  db.all(query, [], (err, rows) => {
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
    active_formation,
  } = req.body || {};

  if (!institution_id || !title || !admission) {
    return res.status(400).json({ error: "Institution, title and admission are required" });
  }
  const stmt = db.prepare(
    "INSERT INTO programs (institution_id, field, degree, duration, intake, title, summary, tuition, mode, admission, highlights, outcomes, image_url, active_formation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
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
      toActiveFlag(active_formation, 1),
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
    active_formation,
  } = req.body || {};
  if (!institution_id || !title || !admission) {
    return res.status(400).json({ error: "Institution, title and admission are required" });
  }
  db.run(
    "UPDATE programs SET institution_id=?, field=?, degree=?, duration=?, intake=?, title=?, summary=?, tuition=?, mode=?, admission=?, highlights=?, outcomes=?, image_url=?, active_formation=? WHERE id=?",
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
      toActiveFlag(active_formation, 1),
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
