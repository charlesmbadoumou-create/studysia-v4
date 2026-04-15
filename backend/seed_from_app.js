import fs from "fs";
import path from "path";
import vm from "vm";
import db, { initDb } from "./db.js";

const appPath = path.resolve("src", "App.jsx");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function now() {
  return new Date().toISOString();
}

function extractProgramsArray(source) {
  const marker = "const programs = [";
  const start = source.indexOf(marker);
  if (start === -1) throw new Error("const programs not found");

  let i = start + marker.length - 1; // at '['
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (; i < source.length; i++) {
    const ch = source[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && source[i - 1] !== "\\") {
      inSingle = !inSingle;
      continue;
    }
    if (!inSingle && !inTemplate && ch === '"' && source[i - 1] !== "\\") {
      inDouble = !inDouble;
      continue;
    }
    if (!inSingle && !inDouble && ch === "`" && source[i - 1] !== "\\") {
      inTemplate = !inTemplate;
      continue;
    }

    if (inSingle || inDouble || inTemplate) continue;

    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) {
        return source.slice(start + "const programs = ".length, i + 1);
      }
    }
  }

  throw new Error("Could not parse programs array");
}

async function seedFromApp() {
  initDb();

  const source = fs.readFileSync(appPath, "utf8");
  const arrayText = extractProgramsArray(source);
  const programs = vm.runInNewContext(`(${arrayText})`);

  await run("DELETE FROM gallery_images");
  await run("DELETE FROM programs");
  await run("DELETE FROM institutions");

  const instMap = new Map();
  for (const p of programs) {
    if (!instMap.has(p.institution)) {
      const result = await run(
        "INSERT INTO institutions (name, handle, city, country, address, contact, whatsapp, logo_url, created_at) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          p.institution || "",
          p.handle || "",
          p.city || "",
          p.country || "Gabon",
          p.address || `${p.city || ""}${p.city && p.country ? ", " : ""}${p.country || ""}`,
          p.contact || "contact@etablissement.ga",
          p.whatsapp || "+24100000000",
          p.logo || "",
          now(),
        ]
      );
      instMap.set(p.institution, result.lastID);
    }
  }

  for (const p of programs) {
    const institutionId = instMap.get(p.institution);
    await run(
      "INSERT INTO programs (institution_id, field, degree, duration, intake, title, summary, tuition, mode, admission, highlights, outcomes, image_url, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        institutionId,
        p.field || "",
        p.degree || "",
        p.duration || "",
        p.intake || "",
        p.title || "",
        p.summary || "",
        p.tuition || "",
        p.mode || "",
        p.admission || "Dossier + entretien",
        JSON.stringify(Array.isArray(p.highlights) ? p.highlights : []),
        JSON.stringify(Array.isArray(p.outcomes) ? p.outcomes : []),
        p.image || "",
        now(),
      ]
    );

    if (Array.isArray(p.gallery) && p.gallery.length) {
      for (const img of p.gallery.slice(0, 5)) {
        await run(
          "INSERT INTO gallery_images (institution_id, image_url, created_at) VALUES (?,?,?)",
          [institutionId, img, now()]
        );
      }
    }
  }

  const instCount = await all("SELECT COUNT(*) as n FROM institutions");
  const progCount = await all("SELECT COUNT(*) as n FROM programs");
  console.log(`Seed from App done. institutions=${instCount[0].n}, programs=${progCount[0].n}`);
  process.exit(0);
}

seedFromApp().catch((err) => {
  console.error(err);
  process.exit(1);
});
