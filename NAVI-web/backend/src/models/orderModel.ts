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

export const crearPedido = async (datos: object, customerUid?: string) => {
  const orderNumber = await siguienteFolio("orders", "#");
  const documento = customerUid
    ? { ...datos, customerUid, orderNumber, status: "Nuevo" }
    : { ...datos, orderNumber, status: "Nuevo" };
  const ref = await orders.add(documento);
  return { id: ref.id, ...documento };
};

// Pedidos de un cliente de la app (filtrados por su uid de Firebase Auth,
// nunca por lo que mande el cliente en la URL/body).
export const listarPedidosPorCliente = async (customerUid: string) => {
  const snap = await orders.where("customerUid", "==", customerUid).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const actualizarPedido = async (id: string, datos: object) => {
  await orders.doc(id).update(datos);
};
