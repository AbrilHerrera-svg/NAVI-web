import type { NextFunction, Request, Response } from "express";
import { auth, db } from "../config/firebase";

// Datos del usuario que ya validamos, disponibles en req.usuario
export interface UsuarioAutenticado {
  uid: string;
  nombre: string;
  email: string;
  rol: string;
}

declare module "express-serve-static-core" {
  interface Request {
    usuario?: UsuarioAutenticado;
  }
}

// Revisa el token que manda el front en el header Authorization: Bearer <token>
export const verificarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    res.status(401).json({ mensaje: "Falta iniciar sesión" });
    return;
  }

  try {
    // 1. el token es de verdad de firebase y no está vencido
    const decodificado = await auth.verifyIdToken(token);

    // 2. el usuario existe en la colección users y está activo
    const snap = await db.collection("users").doc(decodificado.uid).get();
    const datos = snap.data();

    if (!snap.exists || !datos) {
      res.status(403).json({ mensaje: "Tu cuenta no tiene perfil en el sistema" });
      return;
    }
    if (datos.activo === false) {
      res.status(403).json({ mensaje: "Tu cuenta está desactivada" });
      return;
    }

    req.usuario = {
      uid: decodificado.uid,
      nombre: datos.nombre ?? "",
      email: datos.email ?? "",
      rol: datos.rol ?? "",
    };
    next();
  } catch {
    res.status(401).json({ mensaje: "Sesión inválida o vencida" });
  }
};
