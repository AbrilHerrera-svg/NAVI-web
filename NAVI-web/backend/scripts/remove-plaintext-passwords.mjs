// Borra el campo "password" (texto plano) de cualquier documento en users/,
// si existe. La autenticación real vive en Firebase Auth, nunca debe
// duplicarse como texto plano en Firestore.
// Uso: node scripts/remove-plaintext-passwords.mjs   (desde backend/)
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const cuenta = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));
initializeApp({ credential: cert(cuenta) });
const db = getFirestore();

const snapshot = await db.collection("users").get();

let limpiados = 0;
for (const doc of snapshot.docs) {
  if (Object.prototype.hasOwnProperty.call(doc.data(), "password")) {
    await doc.ref.update({ password: FieldValue.delete() });
    console.log(`Campo "password" eliminado de users/${doc.id}`);
    limpiados++;
  }
}

console.log(limpiados ? `Listo, ${limpiados} documento(s) limpiado(s).` : "No se encontró ningún campo password en texto plano.");
