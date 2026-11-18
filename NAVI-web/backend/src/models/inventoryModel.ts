import { db } from "../config/firebase";
import { fromISO, toISO } from "../lib/dates";
import { siguienteFolio } from "./counterModel";
import type { Timestamp } from "firebase-admin/firestore";

const ingredients = db.collection("ingredients");
const movements = db.collection("inventoryMovements");

const movementOut = (id: string, data: Record<string, unknown>) => ({
  id,
  ...data,
  date: toISO(data.date as Timestamp),
});

export const listarIngredientes = async () => {
  const snap = await ingredients.get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const crearIngrediente = async (datos: {
  name: string;
  unit: string;
  unitsPerBox: number;
  costPerBox: number;
  minStock: number;
  initialStock: number;
}) => {
  const { initialStock, ...resto } = datos;
  const ref = await ingredients.add({ ...resto, stock: initialStock });
  return { id: ref.id, ...resto, stock: initialStock };
};

// No incluye stock: la existencia solo cambia por ajuste, compra o venta,
// para que el historial de movimientos siga siendo la única fuente de verdad.
export const actualizarIngrediente = async (
  id: string,
  datos: { name: string; unit: string; unitsPerBox: number; costPerBox: number; minStock: number }
) => {
  await ingredients.doc(id).update(datos);
};

export const eliminarIngrediente = async (id: string) => {
  await ingredients.doc(id).delete();
};

export const listarMovimientos = async () => {
  const snap = await movements.orderBy("date", "desc").get();
  return snap.docs.map((doc) => movementOut(doc.id, doc.data()));
};

// Aplica un delta de cajas al ingrediente y registra el movimiento en una
// sola transacción, para que dos movimientos simultáneos no corrompan el stock.
const aplicarMovimiento = async (input: {
  ingredientId: string;
  type: "Ajuste" | "Merma" | "Compra" | "Venta" | "Cancelación";
  quantity: number;
  date: string;
  reference: string;
  notes?: string;
}) => {
  const ingredientRef = ingredients.doc(input.ingredientId);
  const movementRef = movements.doc();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ingredientRef);
    if (!snap.exists) throw new Error("Ingrediente no encontrado");

    const ingrediente = snap.data()!;
    const nuevoStock = Math.round((ingrediente.stock + input.quantity) * 1000) / 1000;

    tx.update(ingredientRef, { stock: nuevoStock });
    tx.set(movementRef, {
      ingredientId: input.ingredientId,
      ingredientName: ingrediente.name,
      type: input.type,
      quantity: input.quantity,
      date: fromISO(input.date),
      reference: input.reference,
      notes: input.notes ?? null,
    });
  });

  return movementRef.id;
};

export const registrarAjuste = async (input: {
  ingredientId: string;
  type: "Ajuste" | "Merma";
  countedBoxes: number;
  notes: string;
  responsible: string;
  date: string;
  reason: string;
  reference: string;
}) => {
  const snap = await ingredients.doc(input.ingredientId).get();
  if (!snap.exists) throw new Error("Ingrediente no encontrado");

  const delta = Math.round((input.countedBoxes - snap.data()!.stock) * 1000) / 1000;

  return aplicarMovimiento({
    ingredientId: input.ingredientId,
    type: input.type,
    quantity: delta,
    date: input.date,
    reference: input.reference || `Diferencia de conteo · ${input.responsible}`,
    notes: input.notes || input.reason,
  });
};

export const registrarCompra = async (input: {
  ingredientId: string;
  receivedBoxes: number;
  totalCost: number;
  notes: string;
  supplier: string;
  date: string;
  paymentMethod: string;
}) => {
  const folio = await siguienteFolio("purchases", "PUR-");

  return aplicarMovimiento({
    ingredientId: input.ingredientId,
    type: "Compra",
    quantity: input.receivedBoxes,
    date: input.date,
    reference: `${folio} · ${input.supplier} · $${input.totalCost}`,
    notes: input.notes,
  });
};
