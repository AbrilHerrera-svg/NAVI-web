import { db } from "../config/firebase";

const menuItems = db.collection("menuItems");

export const listarMenu = async () => {
  const snap = await menuItems.get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const buscarProducto = async (id: string) => {
  const snap = await menuItems.doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
};

export const crearProducto = async (datos: object) => {
  const ref = await menuItems.add(datos);
  return { id: ref.id, ...datos };
};

export const actualizarProducto = async (id: string, datos: object) => {
  await menuItems.doc(id).update(datos);
};

export const eliminarProducto = async (id: string) => {
  await menuItems.doc(id).delete();
};
