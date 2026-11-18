import { db } from "../config/firebase";

const settings = db.collection("settings");

export const obtenerNegocio = async () => {
  const snap = await settings.doc("business").get();
  return snap.data() ?? null;
};

export const actualizarNegocio = async (datos: object) => {
  await settings.doc("business").set(datos, { merge: true });
};

export const obtenerNotificaciones = async () => {
  const snap = await settings.doc("notifications").get();
  return (snap.data()?.items as object[]) ?? [];
};

export const actualizarNotificaciones = async (items: object[]) => {
  await settings.doc("notifications").set({ items });
};
