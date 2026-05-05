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

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

const AUM_LOGO =
  "https://groupeaumt.com/wp-content/uploads/2022/03/AUM-300x261.png";
const AUM_CAMPUS_IMAGE =
  "https://groupeaumt.com/wp-content/uploads/2022/03/AUM-768x668.png";

const CAMPUSES = [
  {
    name: "AUM Libreville",
    handle: "@aum_libreville",
    city: "Libreville",
    country: "Gabon",
    address: "Boulevard Leon MBA, Libreville",
    contact: "+241 65 70 48 48 / +241 77 27 98 44",
    whatsapp: "+24165704848",
    source_url: "https://groupeaumt.com/aumt-libreville/",
  },
  {
    name: "AUM Port-Gentil",
    handle: "@aum_port_gentil",
    city: "Port-Gentil",
    country: "Gabon",
    address: "Carrefour FORASOL, Port-Gentil",
    contact: "+241 77 49 53 14 / +241 77 00 77 60",
    whatsapp: "+24177495314",
    source_url: "https://groupeaumt.com/aumt-port-gentil/",
  },
  {
    name: "AUM Mouila",
    handle: "@aum_mouila",
    city: "Mouila",
    country: "Gabon",
    address: "CPPA Mouila, Mouila",
    contact: "+241 66 68 68 02",
    whatsapp: "+24166686802",
    source_url: "https://groupeaumt.com/aumt-mouila/",
  },
  {
    name: "AUM Brazzaville",
    handle: "@aum_brazzaville",
    city: "Brazzaville",
    country: "Congo",
    address: "Avenue des Martyrs, Brazzaville",
    contact: "+242 06 967 72 53",
    whatsapp: "+242069677253",
    source_url: "https://groupeaumt.com/aumt-brazzaville/",
  },
  {
    name: "AUM Bangui",
    handle: "@aum_bangui",
    city: "Bangui",
    country: "Centrafrique",
    address: "Campus AUM Bangui",
    contact: "+241 65 70 48 48 / +241 77 27 98 44",
    whatsapp: "+24165704848",
    source_url: "https://groupeaumt.com/aumt-bangui/",
  },
  {
    name: "AUM Kigali",
    handle: "@aum_kigali",
    city: "Kigali",
    country: "Rwanda",
    address: "Gasabo, Secteur Ndera, Kigali",
    contact: "+250 788 30 48 98",
    whatsapp: "+250788304898",
    source_url: "https://groupeaumt.com/aumt-kigali/",
  },
];

const COMMON_ADMISSION =
  "Licence 1 accessible aux bacheliers. Master accessible à Bac+3/4 selon niveau. Sélection sur dossier et entretien.";

const PROGRAM_CATALOG = {
  Libreville: [
    ["Business", "Licence", "Comptabilite - Controle - Audit"],
    ["Business", "Licence", "Finances - Assurances - Banque"],
    ["Business", "Licence", "Marketing et Communication Digitale"],
    ["Business", "Licence", "Supply Chain Management"],
    ["Business", "Master", "Marketing et Communication Digitale"],
    ["Business", "Master", "Management des Entreprises et Gestion des Projets"],
  ],
  "Port-Gentil": [
    ["Business", "Licence", "Comptabilite - Controle - Audit"],
    ["Business", "Licence", "Supply Chain Management"],
    ["Business", "Licence", "Marketing et Communication Digitale"],
    ["Tech", "Licence", "Electrotechnique"],
    ["Tech", "Licence", "Genie industriel"],
    ["Tech", "Licence", "Genie electromecanique"],
    ["Santé", "Licence", "Genie des Procedes et Analyses Biomedicales"],
    ["Business", "Master", "Marketing et Communication Digitale"],
    ["Business", "Master", "Management des Entreprises et Gestion des Projets"],
    ["Tech", "Master", "Ingenierie des Transports"],
    ["Tech", "Master", "Genie climatique"],
    ["Tech", "Master", "Genie Hygiene et Securite Industrielle"],
    ["Santé", "Master", "Genie des Procedes et Analyses Biomedicales"],
  ],
  Mouila: [
    ["Business", "Licence", "Comptabilite - Controle - Audit"],
    ["Business", "Licence", "Banque Finance"],
    ["Business", "Licence", "Marketing & Communication Digitale"],
    ["Business", "Licence", "Entrepreneuriat & Gestion de Projet"],
  ],
  Brazzaville: [
    ["Business", "Licence", "Comptabilite - Controle - Audit"],
    ["Business", "Licence", "Finances - Assurances - Banque"],
    ["Business", "Licence", "Marketing et Communication Digitale"],
    ["Business", "Licence", "Management des Ressources Humaines et E-RH"],
    ["Business", "Master", "Marketing et Communication Digitale"],
    ["Business", "Master", "Management des Entreprises et Gestion des Projets"],
    ["Droit", "Master", "Droits des Affaires et Fiscalite des Entreprises"],
    ["Business", "Master", "Management des finances publiques et de la fiscalite"],
  ],
  Bangui: [
    ["Business", "Licence", "Comptabilite - Controle - Audit"],
    ["Business", "Licence", "Finances - Assurances - Banque"],
    ["Business", "Licence", "Marketing et Communication Digitale"],
    ["Business", "Licence", "Supply Chain Management"],
    ["Droit", "Master", "Droits des Affaires et Fiscalite des Entreprises"],
    ["Business", "Master", "Management des finances publiques et de la fiscalite"],
    ["Business", "Master", "Marketing et Communication Digitale"],
    ["Business", "Master", "Management des Entreprises et Gestion des Projets"],
  ],
  Kigali: [
    ["Business", "Licence", "Comptabilite - Controle - Audit"],
    ["Business", "Licence", "Finances - Assurances - Banque"],
    ["Business", "Licence", "Marketing et Communication Digitale"],
    ["Business", "Master", "Management des Entreprises et Gestion des Projets"],
  ],
};

const IMAGE_BY_FIELD = {
  Business:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  Tech:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  Droit:
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80",
  "Santé":
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
};

function toProgram(field, degree, title, city) {
  const isMaster = degree === "Master";
  return {
    field,
    degree,
    duration: isMaster ? "2 ans" : "3 ans",
    intake: "Rentrée 2026",
    title,
    summary: `Programme AUMT ${city} en ${title.toLowerCase()}.`,
    tuition: "Frais selon filière",
    mode: "Présentiel",
    admission: COMMON_ADMISSION,
    highlights: ["Approche professionnalisante", "Insertion", "Encadrement"],
    outcomes: ["Insertion professionnelle", "Compétences opérationnelles", "Évolution de carrière"],
    image_url: IMAGE_BY_FIELD[field] || IMAGE_BY_FIELD.Business,
  };
}

const LEGACY_MOUILA_PROGRAMS = [
  {
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "Rentrée 2026",
    title: "Licence en Comptabilité Contrôle Audit",
    summary:
      "Parcours orienté comptabilité financière, contrôle de gestion et audit.",
    tuition: "Frais selon filière",
    mode: "Présentiel",
    admission: "Baccalauréat requis. Étude de dossier.",
    highlights: ["Comptabilité", "Contrôle", "Audit"],
    outcomes: ["Assistant comptable", "Contrôleur junior", "Auditeur junior"],
    image_url:
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1600&q=80",
  },
  {
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "Rentrée 2026",
    title: "Licence en Banque Finance",
    summary:
      "Formation aux métiers de la banque, finance d’entreprise et analyse financière.",
    tuition: "Frais selon filière",
    mode: "Présentiel",
    admission: "Baccalauréat requis. Étude de dossier.",
    highlights: ["Banque", "Finance", "Analyse"],
    outcomes: ["Chargé de clientèle", "Analyste junior", "Assistant finance"],
    image_url:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "Rentrée 2026",
    title: "Licence en Marketing & Communication Digitale",
    summary:
      "Formation en communication digitale, marque et stratégie marketing.",
    tuition: "Frais selon filière",
    mode: "Présentiel",
    admission: "Baccalauréat requis. Étude de dossier.",
    highlights: ["Marketing", "Communication", "Digital"],
    outcomes: ["Chargé marketing", "Community manager", "Assistant communication"],
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "Rentrée 2026",
    title: "Licence en Entrepreneuriat & Gestion de Projet",
    summary:
      "Développement de projets, pilotage opérationnel et culture entrepreneuriale.",
    tuition: "Frais selon filière",
    mode: "Présentiel",
    admission: "Baccalauréat requis. Étude de dossier.",
    highlights: ["Projet", "Entrepreneuriat", "Gestion"],
    outcomes: ["Assistant chef de projet", "Entrepreneur", "Coordinateur projet"],
    image_url:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
];

async function upsertInstitution(campus) {
  let row = await get("SELECT id FROM institutions WHERE LOWER(handle) = LOWER(?)", [campus.handle]);
  if (!row) {
    const created = await run(
      "INSERT INTO institutions (name, handle, city, country, address, contact, whatsapp, logo_url, share_whatsapp, share_facebook, share_tiktok, active_etablissement, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        campus.name,
        campus.handle,
        campus.city,
        campus.country,
        campus.address,
        campus.contact,
        campus.whatsapp,
        AUM_LOGO,
        "",
        "https://www.facebook.com/",
        "https://www.tiktok.com/",
        1,
        now(),
      ]
    );
    row = { id: created.lastID };
  } else {
    await run(
      "UPDATE institutions SET name=?, city=?, country=?, address=?, contact=?, whatsapp=?, logo_url=?, active_etablissement=1 WHERE id=?",
      [
        campus.name,
        campus.city,
        campus.country,
        campus.address,
        campus.contact,
        campus.whatsapp,
        AUM_LOGO,
        row.id,
      ]
    );
  }
  return row.id;
}

async function seedAum() {
  await initDb();

  const aumInstitutionIds = [];
  for (const campus of CAMPUSES) {
    const instId = await upsertInstitution(campus);
    aumInstitutionIds.push(instId);

    await run("DELETE FROM gallery_images WHERE institution_id = ?", [instId]);
    await run(
      "INSERT INTO gallery_images (institution_id, image_url, created_at) VALUES (?,?,?)",
      [instId, AUM_LOGO, now()]
    );
    await run(
      "INSERT INTO gallery_images (institution_id, image_url, created_at) VALUES (?,?,?)",
      [instId, AUM_CAMPUS_IMAGE, now()]
    );
  }

  for (let i = 0; i < CAMPUSES.length; i += 1) {
    const campus = CAMPUSES[i];
    const instId = aumInstitutionIds[i];
    const tuples = PROGRAM_CATALOG[campus.city] || [];
    const programs =
      tuples.length > 0
        ? tuples.map(([field, degree, title]) => toProgram(field, degree, title, campus.city))
        : LEGACY_MOUILA_PROGRAMS;

    await run("DELETE FROM programs WHERE institution_id = ?", [instId]);
    for (const p of programs) {
      await run(
        "INSERT INTO programs (institution_id, field, degree, duration, intake, title, summary, tuition, mode, admission, highlights, outcomes, image_url, active_formation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          instId,
          p.field,
          p.degree,
          p.duration,
          p.intake,
          p.title,
          p.summary,
          p.tuition,
          p.mode,
          p.admission,
          JSON.stringify(p.highlights),
          JSON.stringify(p.outcomes),
          p.image_url,
          1,
          now(),
        ]
      );
    }
  }

  console.log("AUM seed done:");
  console.log("- campuses:", aumInstitutionIds.length);
  console.log(
    "- total programs:",
    Object.values(PROGRAM_CATALOG).reduce((acc, list) => acc + list.length, 0)
  );
}

seedAum()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
