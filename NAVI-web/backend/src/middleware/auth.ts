import type { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

declare global {
  namespace Express {
    interface Request {
      uid?: string;
    }
  }
}

// Exige un token de Firebase Auth válido en "Authorization: Bearer <token>".
// Sin esto, cualquiera podía leer o escribir cualquier colección.
export const verificarToken = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ mensaje: "No autorizado" });
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({ mensaje: "No autorizado" });
    return;
  }

  try {
    const decodificado = await getAuth().verifyIdToken(token);
    req.uid = decodificado.uid;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};
