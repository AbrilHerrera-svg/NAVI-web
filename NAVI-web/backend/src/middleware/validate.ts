import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

// Valida y SOBREESCRIBE req.body con el resultado parseado: solo los campos
// definidos en el schema llegan al modelo/Firestore (evita mass-assignment,
// claves tipo "a.b" que mueven campos anidados, __proto__, etc.).
export const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const resultado = schema.safeParse(req.body);

  if (!resultado.success) {
    res.status(400).json({ mensaje: "Datos inválidos", errores: resultado.error.issues });
    return;
  }

  req.body = resultado.data;
  next();
};

// Un id de documento de Firestore: string no vacía, sin "/" (cambiaría la ruta).
const idPattern = /^[A-Za-z0-9_-]{1,200}$/;

export const validateIdParam = (nombre: string) => (req: Request, res: Response, next: NextFunction) => {
  const valor = req.params[nombre];

  if (!valor || !idPattern.test(valor)) {
    res.status(400).json({ mensaje: "Identificador inválido" });
    return;
  }

  next();
};
