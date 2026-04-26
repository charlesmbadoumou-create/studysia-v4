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

const IMAGE_POOL = {
  Business: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
  ],
  Tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
  ],
  Droit: [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&w=1600&q=80",
  ],
  QHSE: [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
  ],
};

const nextIndex = {};
function pickImage(field) {
  const list = IMAGE_POOL[field] || IMAGE_POOL.Business;
  const idx = nextIndex[field] || 0;
  nextIndex[field] = (idx + 1) % list.length;
  return list[idx];
}

async function seedAfram() {
  initDb();

  // Keep users/admins, but reset institutions + programs as requested.
  await run("DELETE FROM gallery_images");
  await run("DELETE FROM programs");
  await run("DELETE FROM institutions");
  await run("DELETE FROM sqlite_sequence WHERE name IN ('institutions','programs','gallery_images')");

  const institution = {
    name: "Academie Franco-Americaine de Management (AFRAM)",
    handle: "@aframgabon",
    city: "Libreville",
    country: "Gabon",
    address: "Rue Andre Mintsa, Batterie IV, B.P. 3931 - Libreville, Gabon",
    contact: "(+241) 066 70 11 84 / 066 70 11 85 / 074 00 00 83",
    whatsapp: "+24174000043",
    logo_url: "/logo-afram.png",
    active_etablissement: 1,
  };

  const instInsert = await run(
    "INSERT INTO institutions (name, handle, city, country, address, contact, whatsapp, logo_url, active_etablissement, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      institution.name,
      institution.handle,
      institution.city,
      institution.country,
      institution.address,
      institution.contact,
      institution.whatsapp,
      institution.logo_url,
      institution.active_etablissement,
      now(),
    ]
  );
  const institutionId = instInsert.lastID;

  const admissionLicence =
    "Baccalaureats acceptes: Bac general, scientifique, litteraire, STT, STG, STI. Frais d'inscription: a partir de 210 000 FCFA. Scolarite annuelle: a partir de 990 000 FCFA. Uniforme: 200 000 FCFA.";
  const admissionMaster =
    "Licence requise en Sciences de Gestion, Economie, Droit, Informatique, QSE ou Environnement. Frais d'inscription: a partir de 350 000 FCFA. Scolarite annuelle: a partir de 1 900 000 FCFA.";

  const programs = [
    ["Business", "Licence", "Management des Organisations", "Pilotage organisationnel, leadership"],
    ["Business", "Licence", "Banque Finance et Assurances", "Finance bancaire, produits d'assurance"],
    ["Business", "Licence", "Comptabilite, Controle, Audit", "Comptabilite, controle de gestion, audit"],
    ["Business", "Licence", "Marketing & Communication Digital", "Commerce electronique, marketing digital"],
    ["Business", "Licence", "Entrepreneuriat & Gestion de Projet", "Montage et gestion de projet"],
    ["Business", "Licence", "Gestion des Ressources Humaines", "Processus RH"],
    ["Business", "Licence", "Economie", "Analyse economique, politiques publiques"],
    ["Droit", "Licence", "Droit", "Droit des affaires, droit prive"],
    ["QHSE", "Licence", "QHSE", "Qualite, Hygiene, Securite et Environnement"],
    ["Tech", "Licence", "Systemes Informatiques et Logiciels", "Developpement logiciel, systemes d'information"],
    ["Business", "Master", "Master Comptabilite, Controle, Audit", "Expertise comptable, audit interne et externe"],
    ["Droit", "Master", "Master Droit", "Droit des affaires avance, contentieux"],
    ["Business", "Master", "Master Finances", "Finance internationale"],
    ["QHSE", "Master", "Master QHSE", "Management environnemental, normes ISO"],
    ["Business", "Master", "Master Achats & Supply Chain", "Chaine logistique, achats strategiques"],
    ["Business", "Master", "Master Management Strategique", "Management general, strategie d'entreprise"],
    ["Business", "Master", "Master Entrepreneuriat & Gestion de Projet", "Montage et gestion de projet"],
  ];

  for (const [field, degree, title, domain] of programs) {
    const isMaster = degree === "Master";
    await run(
      "INSERT INTO programs (institution_id, field, degree, duration, intake, title, summary, tuition, mode, admission, highlights, outcomes, image_url, active_formation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        institutionId,
        field,
        degree,
        isMaster ? "2 ans" : "3 ans",
        "Rentree 2026",
        title,
        `Programme AFRAM axe sur ${domain}.`,
        isMaster ? "A partir de 1 900 000 FCFA / an" : "A partir de 990 000 FCFA / an",
        "Presentiel",
        isMaster ? admissionMaster : admissionLicence,
        JSON.stringify(["Approche professionnalisante", "Corps enseignant experimente", "Diplome LMD"]),
        JSON.stringify(["Insertion professionnelle", "Competences operationnelles", "Evolution de carriere"]),
        pickImage(field),
        1,
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
