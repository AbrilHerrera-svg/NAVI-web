import { db } from "../config/firebase";
import { fromISO, toISO } from "../lib/dates";
import { Timestamp } from "firebase-admin/firestore";

const cashSessions = db.collection("cashSessions");

const sessionOut = (id: string, data: Record<string, unknown>) => {
  const { openedAt, ...resto } = data;
  return {
    id,
    ...resto,
    date: toISO(data.date as Timestamp),
    openedAt: openedAt ? (openedAt as Timestamp).toDate().toISOString() : null,
  };
};

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
    openedAt: Timestamp.now(),
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

// Monto con el que cerró la última caja (efectivo + terminal + transferencias contados).
// La apertura siguiente debe coincidir con este monto. null si nunca se ha cerrado una.
export const ultimoCierre = async () => {
  const snap = await cashSessions.orderBy("date", "desc").limit(30).get();
  const cerrada = snap.docs.find((d) => d.data().status === "Cerrado" && d.data().closing);
  if (!cerrada) return null;

  const { closing, date } = cerrada.data();
  return {
    date: toISO(date as Timestamp),
    amount: Math.round((closing.cashCounted + closing.terminalCounted + closing.transferCounted) * 100) / 100,
  };
};