import { db } from "../config/firebase";

export const buscarUsuarioPorUid = async (uid: string) => {
  const snap = await db.collection("users").doc(uid).get();

  if (!snap.exists) {
    return null;
  }

  return snap.data();
};