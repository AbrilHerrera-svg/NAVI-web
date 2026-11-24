import type { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { buscarUsuarioPorUid } from "../models/userModel";

declare module "express-serve-static-core" {
  interface Request {
    uid?: string;
    rol?: string;
  }
}

// Roles de personal (todo lo que no sea "cliente"). Los endpoints de staff
// (inventario, tareas, caja, usuarios, editar menú/pedidos) deben exigir
// alguno de estos con requireRole; sin eso, cualquier cuenta autenticada
// -incluido un cliente de la app móvil- podía llamarlos con solo tener un
// token válido.
export const ROLES_STAFF = ["admin", "encargado", "cajero", "barista", "cocina"] as const;

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
  } catch {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

// Exige que el usuario del token tenga uno de los roles dados; consulta su
// perfil en Firestore (igual que /api/auth/me) porque el rol no viene en el
// token. Va después de verificarToken.
export const requireRole = (...rolesPermitidos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = await buscarUsuarioPorUid(req.uid as string);
      const rol = usuario?.role as string | undefined;

      if (!rol || !rolesPermitidos.includes(rol)) {
        res.status(403).json({ mensaje: "No tienes permiso para esto" });
        return;
      }

      req.rol = rol;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el servidor" });
    }
  };
};
