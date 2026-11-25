// Fuerza una contraseña nueva para una cuenta de Firebase Auth (el Admin SDK
// puede hacerlo sin pedir la contraseña anterior; la consola web no lo permite).
// Uso: node scripts/reset-password.mjs correo@ejemplo.com nuevaContraseña
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [email, nuevaContrasena] = process.argv.slice(2);

if (!email || !nuevaContrasena) {
  console.error("Uso: node scripts/reset-password.mjs correo@ejemplo.com nuevaContraseña");
  process.exit(1);
}

if (nuevaContrasena.length < 6) {
  console.error("La contraseña debe tener al menos 6 caracteres (mínimo de Firebase Auth).");
  process.exit(1);
}

const cuenta = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));
initializeApp({ credential: cert(cuenta) });

const usuario = await getAuth().getUserByEmail(email);
await getAuth().updateUser(usuario.uid, { password: nuevaContrasena });

console.log(`Contraseña actualizada para ${email} (uid: ${usuario.uid}).`);
