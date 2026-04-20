import db, { initDb } from "./db.js";

function now() {
  return new Date().toISOString();
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function seedAfram() {
  initDb();

  // Keep users/admins, but reset institutions + programs as requested.
  await run("DELETE FROM gallery_images");
  await run("DELETE FROM programs");
  await run("DELETE FROM institutions");
  await run("DELETE FROM sqlite_sequence WHERE name IN ('institutions','programs','gallery_images')");

  const institution = {
    name: "Académie Franco-Américaine de Management (AFRAM)",
    handle: "@aframgabon",
    city: "Libreville",
    country: "Gabon",
    address: "Rue André Mintsa, Batterie IV, B.P. 3931 - Libreville, Gabon",
    contact: "(+241) 066 70 11 84 / 066 70 11 85 / 074 00 00 83",
    whatsapp: "+24174000043",
    logo_url: "/logo-afram.png",
  };

  const instInsert = await run(
    "INSERT INTO institutions (name, handle, city, country, address, contact, whatsapp, logo_url, created_at) VALUES (?,?,?,?,?,?,?,?,?)",
    [
      institution.name,
      institution.handle,
      institution.city,
      institution.country,
      institution.address,
      institution.contact,
      institution.whatsapp,
      institution.logo_url,
      now(),
    ]
  );
  const institutionId = instInsert.lastID;

  const admissionLicence =
    "Baccalauréats acceptés: Bac général, scientifique, littéraire, STT, STG, STI. Frais d'inscription: à partir de 210 000 FCFA. Scolarité annuelle: à partir de 990 000 FCFA. Uniforme: 200 000 FCFA.";
  const admissionMaster =
    "Licence requise en Sciences de Gestion, Économie, Droit, Informatique, QSE ou Environnement. Frais d'inscription: à partir de 350 000 FCFA. Scolarité annuelle: à partir de 1 900 000 FCFA.";

  const programs = [
    ["Business", "Licence", "Management des Organisations", "Pilotage organisationnel, leadership"],
    ["Business", "Licence", "Banque Finance et Assurances", "Finance bancaire, produits d’assurance"],
    ["Business", "Licence", "Comptabilité, Contrôle, Audit", "Comptabilité, contrôle de gestion, audit"],
    ["Business", "Licence", "Marketing & Communication Digital", "Commerce électronique, marketing digital"],
    ["Business", "Licence", "Entrepreneuriat & Gestion de Projet", "Montage et gestion de projet"],
    ["Business", "Licence", "Gestion des Ressources Humaines", "Processus RH"],
    ["Business", "Licence", "Économie", "Analyse économique, politiques publiques"],
    ["Droit", "Licence", "Droit", "Droit des affaires, droit privé"],
    ["QHSE", "Licence", "QHSE", "Qualité, Hygiène, Sécurité et Environnement"],
    ["Tech", "Licence", "Systèmes Informatiques et Logiciels", "Développement logiciel, systèmes d’information"],
    ["Business", "Master", "Master Comptabilité, Contrôle, Audit", "Expertise comptable, audit interne et externe"],
    ["Droit", "Master", "Master Droit", "Droit des affaires avancé, contentieux"],
    ["Business", "Master", "Master Finances", "Finance internationale"],
    ["QHSE", "Master", "Master QHSE", "Management environnemental, normes ISO"],
    ["Business", "Master", "Master Achats & Supply Chain", "Chaîne logistique, achats stratégiques"],
    ["Business", "Master", "Master Management Stratégique", "Management général, stratégie d’entreprise"],
    ["Business", "Master", "Master Entrepreneuriat & Gestion de Projet", "Montage et gestion de projet"],
  ];

  for (const [field, degree, title, domain] of programs) {
    const isMaster = degree === "Master";
    await run(
      "INSERT INTO programs (institution_id, field, degree, duration, intake, title, summary, tuition, mode, admission, highlights, outcomes, image_url, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        institutionId,
        field,
        degree,
        isMaster ? "2 ans" : "3 ans",
        "Rentrée 2026",
        title,
        `Programme AFRAM axé sur ${domain}.`,
        isMaster ? "À partir de 1 900 000 FCFA / an" : "À partir de 990 000 FCFA / an",
        "Présentiel",
        isMaster ? admissionMaster : admissionLicence,
        JSON.stringify(["Approche professionnalisante", "Corps enseignant expérimenté", "Diplôme LMD"]),
        JSON.stringify(["Insertion professionnelle", "Compétences opérationnelles", "Évolution de carrière"]),
        "/logo-afram.png",
        now(),
      ]
    );
  }

  console.log("AFRAM seed done:");
  console.log("- institutions:", 1);
  console.log("- programs:", programs.length);
}

seedAfram()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

