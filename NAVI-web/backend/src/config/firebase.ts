import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// leer la llave de la cuenta de servicio
const cuenta = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));

// iniciar firebase admin
initializeApp({ credential: cert(cuenta) });

// base de datos
export const db = getFirestore();

// autenticación (la usa middleware/verificarToken)
export const auth = getAuth();