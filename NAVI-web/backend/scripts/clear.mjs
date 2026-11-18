// Borra todos los docs de las colecciones de datos (no toca roles ni counters).
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const cuenta = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));
initializeApp({ credential: cert(cuenta) });
const db = getFirestore();

const collectionsToClear = [
  "users",
  "menuItems",
  "ingredients",
  "recipes",
  "inventoryMovements",
  "orders",
  "tasks",
  "cashSessions",
  "settings",
];

for (const name of collectionsToClear) {
  const snap = await db.collection(name).get();
  const batch = db.batch();
  snap.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`✓ ${name}: ${snap.size} docs borrados`);
}
