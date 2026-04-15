import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import db, { initDb } from "./db.js";

dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

const uploadsDir = path.resolve("backend", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

function now() {
  return new Date().toISOString();
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function seed() {
  initDb();

  const adminEmail = "admin@studysia.com";
  const adminPassword = "Admin123!";
  const hash = bcrypt.hashSync(adminPassword, 10);

  await run(
    "INSERT OR IGNORE INTO users (name, email, password_hash, role, created_at) VALUES (?,?,?,?,?)",
    ["Studysia Admin", adminEmail, hash, "admin", now()]
  );

  // Minimal institution & program sample. Frontend Admin can seed full data via UI.
  const inst = await run(
    "INSERT INTO institutions (name, handle, city, country, address, contact, whatsapp, logo_url, created_at) VALUES (?,?,?,?,?,?,?,?,?)",
    [
      "Université Omar Bongo",
      "@uob_gabon",
      "Libreville",
      "Gabon",
      "Libreville, Gabon",
      "contact@uob.ga",
      "+24100000000",
      "/uploads/logo-uob.png",
      now(),
    ]
  );

  await run(
    "INSERT INTO programs (institution_id, field, degree, duration, intake, title, summary, tuition, mode, admission, highlights, outcomes, image_url, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      inst.lastID,
      "Business",
      "Master",
      "2 ans",
      "Rentrée Octobre 2026",
      "Master en Management des Organisations",
      "Programme axé sur la stratégie, la gestion des ressources humaines et la conduite du changement.",
      "À partir de 787 148 FCFA / an",
      "Présentiel",
      "Dossier + entretien",
      JSON.stringify(["Stratégie", "RH", "Pilotage"]),
      JSON.stringify(["Chef de projet", "Manager RH", "Consultant junior"]),
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
      now(),
    ]
  );

  console.log("Seed completed. Admin credentials:");
  console.log("email:", adminEmail);
  console.log("password:", adminPassword);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
