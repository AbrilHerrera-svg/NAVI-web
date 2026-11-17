import { db } from "../config/firebase";

const users = db.collection("users");

export const buscarUsuarioPorUid = async (uid: string) => {
  const snap = await users.doc(uid).get();

  if (!snap.exists) {
    return null;
  }

  return snap.data();
};

export const listarUsuarios = async () => {
  const snap = await users.get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Sin cuenta de Firebase Auth todavía, el id se genera aquí; cuando se
// cree la cuenta real, el doc debería migrarse a usar ese uid como id.
export const crearUsuario = async (datos: object) => {
  const ref = await users.add(datos);
  return { id: ref.id, ...datos };
};

export const actualizarUsuario = async (uid: string, datos: object) => {
  await users.doc(uid).update(datos);
};

export const eliminarUsuario = async (uid: string) => {
  await users.doc(uid).delete();
};