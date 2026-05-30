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

const allowedOrigins = CORS_ORIGIN === "*"
  ? ["*"]
  : CORS_ORIGIN.split(",").map((v) => v.trim()).filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*")) return callback(null, true);
      return callback(null, allowedOrigins.includes(origin));
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

await initDb();

function now() {
  return new Date().toISOString();
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeKey(value = "") {
  try {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  } catch {
    return String(value || "").toLowerCase().trim();
  }
}

function titleToLines(title, maxLineLen = 24, maxLines = 3) {
  const words = String(title || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length <= maxLineLen || current.length === 0) {
      current = next;
      continue;
    }
    lines.push(current);
    current = w;
    if (lines.length >= maxLines) break;
  }
  if (lines.length < maxLines && current) lines.push(current);
  if (lines.length > maxLines) lines.length = maxLines;
  return lines;
}

function fieldPalette(field) {
  const key = normalizeKey(field);
  if (key.includes("tech") || key.includes("digital") || key.includes("informat")) {
    return { a: "#00C2FF", b: "#7C3AED", c: "#FF2AA3" };
  }
  if (key.includes("sant") || key.includes("med") || key.includes("pharm")) {
    return { a: "#00E887", b: "#00C2FF", c: "#FFB703" };
  }
  if (key.includes("ingen") || key.includes("genie")) {
    return { a: "#FF6A00", b: "#00C2FF", c: "#7C3AED" };
  }
  if (key.includes("art") || key.includes("crea") || key.includes("design")) {
    return { a: "#FF2AA3", b: "#FF6A00", c: "#FFB703" };
  }
  // business/default
  return { a: "#FF2AA3", b: "#FF6A00", c: "#FFB703" };
}

function programVisualSvg({ program, institution }) {
  const title = escapeXml(program?.title || "Formation");
  const inst = escapeXml(institution?.name || "Établissement");
  const city = escapeXml(institution?.city || "");
  const country = escapeXml(institution?.country || "");
  const degree = escapeXml(program?.degree || "");
  const mode = escapeXml(program?.mode || "");
  const tuition = escapeXml(program?.tuition || "");
  const homologue = Number(institution?.homologue || 0) === 1;
  const duration = escapeXml(program?.duration || "");
  const admission = escapeXml(program?.admission || "");
  const field = escapeXml(program?.field || "");
  const palette = fieldPalette(program?.field || "");

  const meta = [degree, mode].filter(Boolean).join(" · ");
  const meta2 = [duration, field].filter(Boolean).join(" · ");
  const place = [city, country].filter(Boolean).join(" — ");
  const titleLines = titleToLines(program?.title || "Formation", 24, 3).map(escapeXml);

  // 1080x1920 looks great on mobile (TikTok-style feed); we render it as a full-screen visual.
  // Keep it SVG-only (no remote <image>) to avoid CORS issues with logo URLs.
  // Pop-vibrant: keep the center card readable but not "washed out".
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.a}"/>
      <stop offset="0.48" stop-color="${palette.b}"/>
      <stop offset="1" stop-color="${palette.c}"/>
    </linearGradient>
    <linearGradient id="pill" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${palette.a}"/>
      <stop offset="1" stop-color="${palette.c}"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.78"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.60"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.14" stroke-width="1"/>
    </pattern>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#f7b1c6" flood-opacity="0.35"/>
    </filter>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>

  <!-- vibrant background -->
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <rect width="1080" height="1920" fill="url(#grid)"/>
  <circle cx="170" cy="300" r="220" fill="#ffffff" fill-opacity="0.22"/>
  <circle cx="940" cy="520" r="260" fill="#ffffff" fill-opacity="0.18"/>
  <circle cx="860" cy="260" r="160" fill="#000000" fill-opacity="0.10"/>
  <circle cx="260" cy="620" r="180" fill="#000000" fill-opacity="0.08"/>

  <!-- glass main card -->
  <g filter="url(#cardShadow)">
    <rect x="70" y="300" width="940" height="1260" rx="64" fill="url(#glass)" stroke="#ffffff" stroke-opacity="0.55"/>
  </g>

  <!-- glow rings -->
  <circle cx="115" cy="1550" r="260" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="10"/>
  <circle cx="980" cy="1560" r="190" fill="none" stroke="#000000" stroke-opacity="0.10" stroke-width="8"/>

  <g>
    <rect x="130" y="370" width="300" height="64" rx="32" fill="url(#pill)"/>
    <text x="280" y="412" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#ffffff" font-weight="800" letter-spacing="2">STUDYSIA</text>
  </g>

  <text x="130" y="520" font-family="Arial, sans-serif" font-size="30" fill="#0f172a" font-weight="900">${escapeXml(meta)}</text>
  <text x="130" y="568" font-family="Arial, sans-serif" font-size="24" fill="#334155" font-weight="700" opacity="0.9">${escapeXml(meta2)}</text>

  ${homologue ? `<g>
    <rect x="720" y="500" width="260" height="60" rx="30" fill="#0f172a" fill-opacity="0.86"/>
    <circle cx="760" cy="530" r="12" fill="#34d399"/>
    <path d="M754 530l6 6 12-15" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="850" y="539" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#ffffff" font-weight="800">Homologué</text>
  </g>` : ""}

  <text x="130" y="720" font-family="Arial, sans-serif" font-size="76" fill="#0b1220" font-weight="900">
    ${titleLines.map((ln, idx) => `<tspan x="130" dy="${idx === 0 ? 0 : 88}">${ln}</tspan>`).join("")}
  </text>

  <g>
    <rect x="130" y="980" width="820" height="110" rx="34" fill="#ffffff" fill-opacity="0.75" stroke="#ffffff" stroke-opacity="0.55"/>
    <text x="170" y="1048" font-family="Arial, sans-serif" font-size="30" fill="#0f172a" font-weight="900">${inst}</text>
    <text x="170" y="1088" font-family="Arial, sans-serif" font-size="24" fill="#334155" font-weight="700" opacity="0.85">${escapeXml(place)}</text>
  </g>

  <g>
    <rect x="130" y="1140" width="400" height="140" rx="38" fill="#0f172a" fill-opacity="0.88"/>
    <text x="170" y="1200" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" font-weight="800" opacity="0.92">Frais</text>
    <text x="170" y="1252" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" font-weight="900">${tuition ? tuition : "Sur demande"}</text>
  </g>

  <g>
    <rect x="550" y="1140" width="400" height="140" rx="38" fill="#ffffff" fill-opacity="0.75" stroke="#ffffff" stroke-opacity="0.55"/>
    <text x="590" y="1200" font-family="Arial, sans-serif" font-size="24" fill="#0f172a" font-weight="900">Admission</text>
    <text x="590" y="1252" font-family="Arial, sans-serif" font-size="28" fill="#0f172a" font-weight="800">${admission}</text>
  </g>

  <g>
    <rect x="130" y="1390" width="820" height="92" rx="46" fill="url(#pill)"/>
    <text x="540" y="1450" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#ffffff" font-weight="900">Voir l’offre</text>
  </g>

  <text x="130" y="1528" font-family="Arial, sans-serif" font-size="22" fill="#0f172a" opacity="0.65">
    Glissez pour voir les détails · studysia.com
  </text>
</svg>`;
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

function getUserFromAuthHeader(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function canReadInactive(req, institutionId = null) {
  const user = getUserFromAuthHeader(req);
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "institution") {
    if (institutionId === null) return true;
    return Number(user.institution_id) === Number(institutionId);
  }
  return false;
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
  db.run("INSERT INTO users (name, email, password_hash, role, institution_id, created_at) VALUES (?,?,?,?,?,?)", [name, email, hash, userRole, linkedInstitutionId, createdAt], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, name, email, role: userRole, institution_id: linkedInstitutionId });
  });
});

app.get("/api/admin/users", authRequired, adminOnly, (req, res) => {
  db.all(
    `SELECT u.id, u.name, u.email, u.role, u.institution_id, u.created_at, i.name AS institution_name
     FROM users u
     LEFT JOIN institutions i ON i.id = u.institution_id
     ORDER BY u.id DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
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
  db.run("INSERT INTO users (name, email, password_hash, role, institution_id, created_at) VALUES (?,?,?,?,?,?)", [name, email, hash, userRole, linkedInstitutionId, createdAt], function (err) {
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

app.put("/api/admin/users/:id", authRequired, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  const { name, email, role, institution_id, password } = req.body || {};
  if (!name || !email || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const normalizedRole = String(role || "").trim().toLowerCase();
  const allowedRoles = new Set(["user", "institution", "admin"]);
  if (!allowedRoles.has(normalizedRole)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const linkedInstitutionId =
    normalizedRole === "institution" && institution_id ? Number(institution_id) : null;
  if (normalizedRole === "institution" && !linkedInstitutionId) {
    return res.status(400).json({ error: "institution_id is required for institution accounts" });
  }
  const updates = ["name = ?", "email = ?", "role = ?", "institution_id = ?"];
  const params = [name, email, normalizedRole, linkedInstitutionId];
  if (password && String(password).trim()) {
    updates.push("password_hash = ?");
    params.push(bcrypt.hashSync(String(password).trim(), 10));
  }
  params.push(id);
  db.run(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ ok: this.changes > 0 });
  });
});

app.delete("/api/admin/users/:id", authRequired, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  if (req.user?.id === id) {
    return res.status(400).json({ error: "Impossible de supprimer votre propre compte admin" });
  }
  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ ok: this.changes > 0 });
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

app.post("/api/auth/change-password", authRequired, (req, res) => {
  const { current_password, new_password } = req.body || {};
  if (!current_password || !new_password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  if (String(new_password).trim().length < 6) {
    return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" });
  }

  db.get("SELECT id, password_hash FROM users WHERE id = ?", [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Utilisateur introuvable" });

    const ok = bcrypt.compareSync(String(current_password), row.password_hash || "");
    if (!ok) return res.status(401).json({ error: "Mot de passe actuel incorrect" });

    const nextHash = bcrypt.hashSync(String(new_password).trim(), 10);
    db.run("UPDATE users SET password_hash = ? WHERE id = ?", [nextHash, req.user.id], function (uErr) {
      if (uErr) return res.status(400).json({ error: uErr.message });
      return res.json({ ok: this.changes > 0 });
    });
  });
});

app.get("/api/institutions", (req, res) => {
  const query = includeInactive(req) && canReadInactive(req)
    ? "SELECT * FROM institutions ORDER BY id DESC"
    : "SELECT * FROM institutions WHERE active_etablissement = 1 ORDER BY id DESC";
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/institutions/:id", (req, res) => {
  const id = Number(req.params.id);
  const showInactive = includeInactive(req) && canReadInactive(req, id);
  const instQuery = showInactive
    ? "SELECT * FROM institutions WHERE id = ?"
    : "SELECT * FROM institutions WHERE id = ? AND active_etablissement = 1";
  db.get(instQuery, [id], (err, inst) => {
    if (err || !inst) return res.status(404).json({ error: "Not found" });
    db.all("SELECT * FROM gallery_images WHERE institution_id = ?", [id], (gerr, gallery) => {
      if (gerr) return res.status(500).json({ error: gerr.message });
      const programsQuery = showInactive
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
  const {
    name,
    handle,
    city,
    country,
    address,
    contact,
    whatsapp,
    logo_url,
    share_whatsapp,
    share_facebook,
    share_tiktok,
    homologue,
    active_etablissement,
  } = req.body || {};
  if (!name || !city || !country) {
    return res.status(400).json({ error: "Name, city and country are required" });
  }
  db.run(
    "INSERT INTO institutions (name, handle, city, country, address, contact, whatsapp, logo_url, share_whatsapp, share_facebook, share_tiktok, homologue, active_etablissement, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      name,
      handle,
      city,
      country,
      address,
      contact,
      whatsapp,
      logo_url,
      share_whatsapp || "",
      share_facebook || "",
      share_tiktok || "",
      toActiveFlag(homologue, 0),
      toActiveFlag(active_etablissement, 1),
      now(),
    ],
    function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
    }
  );
});

app.put("/api/institutions/:id", authRequired, (req, res) => {
  const id = Number(req.params.id);
  const {
    name,
    handle,
    city,
    country,
    address,
    contact,
    whatsapp,
    logo_url,
    share_whatsapp,
    share_facebook,
    share_tiktok,
    homologue,
    active_etablissement,
  } = req.body || {};
  const isAdmin = req.user?.role === "admin";
  const isOwnerInstitution = req.user?.role === "institution" && Number(req.user?.institution_id) === id;
  if (!isAdmin && !isOwnerInstitution) {
    return res.status(403).json({ error: "Forbidden" });
  }
  if (isAdmin && (!name || !city || !country)) {
    return res.status(400).json({ error: "Name, city and country are required" });
  }
  if (isOwnerInstitution && !isAdmin) {
    db.run(
      "UPDATE institutions SET contact=?, whatsapp=?, share_whatsapp=?, share_facebook=?, share_tiktok=?, homologue=?, active_etablissement=? WHERE id=?",
      [contact || "", whatsapp || "", share_whatsapp || "", share_facebook || "", share_tiktok || "", toActiveFlag(homologue, 0), toActiveFlag(active_etablissement, 1), id],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        db.get("SELECT * FROM institutions WHERE id = ?", [id], (getErr, row) => {
          if (getErr) return res.status(500).json({ error: getErr.message });
          res.json({ ok: this.changes > 0, institution: row || null });
        });
      }
    );
    return;
  }
  db.run(
    "UPDATE institutions SET name=?, handle=?, city=?, country=?, address=?, contact=?, whatsapp=?, logo_url=?, share_whatsapp=?, share_facebook=?, share_tiktok=?, homologue=?, active_etablissement=? WHERE id=?",
    [
      name,
      handle,
      city,
      country,
      address,
      contact,
      whatsapp,
      logo_url,
      share_whatsapp || "",
      share_facebook || "",
      share_tiktok || "",
      toActiveFlag(homologue, 0),
      toActiveFlag(active_etablissement, 1),
      id,
    ],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      db.get("SELECT * FROM institutions WHERE id = ?", [id], (getErr, row) => {
        if (getErr) return res.status(500).json({ error: getErr.message });
        res.json({ ok: this.changes > 0, institution: row || null });
      });
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
  const query = includeInactive(req) && canReadInactive(req)
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

// Auto-generated visual for a program (TikTok-style card), SVG-only for maximum compatibility.
app.get("/api/programs/:id/visual.svg", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).send("Bad id");

  db.get(
    `SELECT p.*, i.name as institution_name, i.city as institution_city, i.country as institution_country, i.homologue as institution_homologue
     FROM programs p
     INNER JOIN institutions i ON i.id = p.institution_id
     WHERE p.id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).send("DB error");
      if (!row) return res.status(404).send("Not found");

      const svg = programVisualSvg({
        program: row,
        institution: {
          name: row.institution_name,
          city: row.institution_city,
          country: row.institution_country,
          homologue: row.institution_homologue,
        },
      });

      res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(svg);
    }
  );
});

app.post("/api/programs", authRequired, (req, res) => {
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
  const isAdmin = req.user?.role === "admin";
  const isOwnerInstitution =
    req.user?.role === "institution" && Number(req.user?.institution_id) === Number(institution_id);
  if (!isAdmin && !isOwnerInstitution) {
    return res.status(403).json({ error: "Forbidden" });
  }
  db.run(
    "INSERT INTO programs (institution_id, field, degree, duration, intake, title, summary, tuition, mode, admission, highlights, outcomes, image_url, active_formation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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

app.put("/api/programs/:id", authRequired, (req, res) => {
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
  const isAdmin = req.user?.role === "admin";
  if (isAdmin) {
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
    return;
  }
  if (req.user?.role !== "institution") {
    return res.status(403).json({ error: "Forbidden" });
  }
  db.get("SELECT institution_id FROM programs WHERE id = ?", [id], (findErr, row) => {
    if (findErr) return res.status(500).json({ error: findErr.message });
    if (!row) return res.status(404).json({ error: "Not found" });
    if (Number(row.institution_id) !== Number(req.user?.institution_id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    db.run(
      "UPDATE programs SET active_formation=? WHERE id=?",
      [toActiveFlag(active_formation, 1), id],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ ok: this.changes > 0 });
      }
    );
  });
});

app.delete("/api/programs/:id", authRequired, (req, res) => {
  const id = Number(req.params.id);
  const isAdmin = req.user?.role === "admin";
  if (isAdmin) {
    db.run("DELETE FROM programs WHERE id = ?", [id], function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ ok: this.changes > 0 });
    });
    return;
  }
  if (req.user?.role !== "institution") {
    return res.status(403).json({ error: "Forbidden" });
  }
  db.get("SELECT institution_id FROM programs WHERE id = ?", [id], (findErr, row) => {
    if (findErr) return res.status(500).json({ error: findErr.message });
    if (!row) return res.status(404).json({ error: "Not found" });
    if (Number(row.institution_id) !== Number(req.user?.institution_id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    db.run("DELETE FROM programs WHERE id = ?", [id], function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ ok: this.changes > 0 });
    });
  });
});

app.post("/api/institutions/:id/gallery", authRequired, (req, res) => {
  const id = Number(req.params.id);
  const { image_url } = req.body || {};
  if (!image_url) return res.status(400).json({ error: "image_url required" });
  const isAdmin = req.user?.role === "admin";
  const isOwnerInstitution = req.user?.role === "institution" && Number(req.user?.institution_id) === id;
  if (!isAdmin && !isOwnerInstitution) {
    return res.status(403).json({ error: "Forbidden" });
  }
  db.run("INSERT INTO gallery_images (institution_id, image_url, created_at) VALUES (?,?,?)", [id, image_url, now()], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.delete("/api/institutions/:id/gallery/:imageId", authRequired, (req, res) => {
  const institutionId = Number(req.params.id);
  const imageId = Number(req.params.imageId);
  const isAdmin = req.user?.role === "admin";
  const isOwnerInstitution = req.user?.role === "institution" && Number(req.user?.institution_id) === institutionId;
  if (!isAdmin && !isOwnerInstitution) {
    return res.status(403).json({ error: "Forbidden" });
  }
  db.get("SELECT institution_id FROM gallery_images WHERE id = ?", [imageId], (gErr, row) => {
    if (gErr) return res.status(400).json({ error: gErr.message });
    if (!row) return res.status(404).json({ error: "Image not found" });
    if (!isAdmin && Number(row.institution_id) !== institutionId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    db.run("DELETE FROM gallery_images WHERE id = ?", [imageId], function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ ok: this.changes > 0 });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Studysia backend running on http://localhost:${PORT}`);
});
