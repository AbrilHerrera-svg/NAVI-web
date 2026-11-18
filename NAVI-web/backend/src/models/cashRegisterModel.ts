import { db } from "../config/firebase";
import { fromISO, toISO } from "../lib/dates";
import type { Timestamp } from "firebase-admin/firestore";

const cashSessions = db.collection("cashSessions");

const sessionOut = (id: string, data: Record<string, unknown>) => ({
  id,
  ...data,
  date: toISO(data.date as Timestamp),
});

export const buscarSesion = async (fechaISO: string) => {
  const snap = await cashSessions.where("date", "==", fromISO(fechaISO)).limit(1).get();
  if (snap.empty) return null;
  return sessionOut(snap.docs[0].id, snap.docs[0].data());
};

export const abrirSesion = async (
  fechaISO: string,
  datos: { openedBy: string; initialFund: number }
) => {
  const ref = await cashSessions.add({
    ...datos,
    date: fromISO(fechaISO),
    status: "Abierto",
    salesByMethod: [],
    dailyExpenses: [],
    refunds: [],
  });
  return buscarSesion(fechaISO).then((s) => s!);
};

export const cerrarSesion = async (
  id: string,
  closing: { cashCounted: number; terminalCounted: number; transferCounted: number; difference: number; reason?: string }
) => {
  await cashSessions.doc(id).update({ status: "Cerrado", closing });
};
