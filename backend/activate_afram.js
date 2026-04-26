import db, { initDb } from "./db.js";

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function activateAframOnly() {
  initDb();
  await run("UPDATE institutions SET active_etablissement = 0");
  await run("UPDATE programs SET active_formation = 0");

  await run(
    "UPDATE institutions SET active_etablissement = 1 WHERE LOWER(name) LIKE '%afram%' OR LOWER(handle) LIKE '%afram%'"
  );

  await run(
    `UPDATE programs
     SET active_formation = 1
     WHERE institution_id IN (
       SELECT id FROM institutions
       WHERE active_etablissement = 1
     )`
  );

  console.log("Activation complete:");
  console.log("- Active institutions: AFRAM only");
  console.log("- Active programs: linked to active institutions");
}

activateAframOnly()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

