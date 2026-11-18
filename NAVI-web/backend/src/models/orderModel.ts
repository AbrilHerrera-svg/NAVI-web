import { db } from "../config/firebase";
import { siguienteFolio } from "./counterModel";

const orders = db.collection("orders");

export const listarPedidos = async () => {
  const snap = await orders.get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const buscarPedido = async (id: string) => {
  const snap = await orders.doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
};

export const crearPedido = async (datos: object) => {
  const orderNumber = await siguienteFolio("orders", "#");
  const ref = await orders.add({ ...datos, orderNumber, status: "Nuevo" });
  return { id: ref.id, orderNumber, status: "Nuevo", ...datos };
};

export const actualizarPedido = async (id: string, datos: object) => {
  await orders.doc(id).update(datos);
};
