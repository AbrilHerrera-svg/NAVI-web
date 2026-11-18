import { db } from "../config/firebase";
import { fromISO, toISO } from "../lib/dates";
import type { Timestamp } from "firebase-admin/firestore";

const tasks = db.collection("tasks");

const taskOut = (id: string, data: Record<string, unknown>) => ({
  id,
  ...data,
  date: toISO(data.date as Timestamp),
});

export const listarTareas = async (fechaISO: string) => {
  const snap = await tasks.where("date", "==", fromISO(fechaISO)).get();
  return snap.docs.map((doc) => taskOut(doc.id, doc.data()));
};

export const crearTarea = async (fechaISO: string, datos: object) => {
  const ref = await tasks.add({ ...datos, date: fromISO(fechaISO), done: false });
  return taskOut(ref.id, { ...datos, date: fromISO(fechaISO), done: false });
};

export const actualizarTarea = async (id: string, datos: object) => {
  await tasks.doc(id).update(datos);
};

export const eliminarTarea = async (id: string) => {
  await tasks.doc(id).delete();
};
