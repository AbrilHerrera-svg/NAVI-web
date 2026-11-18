import { db } from "../config/firebase";

const recipes = db.collection("recipes");

// Doc id = id del producto o extra (ver features/orders) que consume la receta.
export const buscarReceta = async (productoId: string) => {
  const snap = await recipes.doc(productoId).get();
  return snap.exists ? snap.data()!.lines : [];
};

export const guardarReceta = async (productoId: string, lines: object[]) => {
  await recipes.doc(productoId).set({ lines });
};
