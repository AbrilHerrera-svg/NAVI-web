import { db } from "../config/firebase";

const extras = db.collection("extras");

export const listarExtras = async () => {
  const snap = await extras.get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const crearExtra = async (datos: object) => {
  const ref = await extras.add(datos);
  return { id: ref.id, ...datos };
};

export const actualizarExtra = async (id: string, datos: object) => {
  await extras.doc(id).update(datos);
};

export const eliminarExtra = async (id: string) => {
  await extras.doc(id).delete();
};
