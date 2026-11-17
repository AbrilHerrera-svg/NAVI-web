import { db } from "../config/firebase";

const counters = db.collection("counters");

// Saca el siguiente número de folio sin que dos personas puedan sacar el
// mismo al mismo tiempo (ej. dos cajeros cobrando a la vez nunca generan el
// mismo "#101"). Ej. siguienteFolio("orders", "#") -> "#101".
export const siguienteFolio = async (nombre: string, prefijo: string) => {
  const ref = counters.doc(nombre);

  const siguiente = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const ultimo = snap.exists ? (snap.data()!.ultimo as number) : 0;
    const nuevo = ultimo + 1;
    tx.set(ref, { ultimo: nuevo }, { merge: true });
    return nuevo;
  });

  return `${prefijo}${siguiente}`;
};
