import { z } from "zod";

// Roles tal como se guardan en Firestore (ver authController.roles).
const rolFirestore = z.enum(["admin", "encargado", "cajero", "barista", "cocina"]);

export const crearUsuarioSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(30).optional(),
    role: rolFirestore,
    status: z.enum(["Activo", "Inactivo"]),
    shift: z.enum(["Matutino", "Vespertino"]),
  })
  .strict();

export const actualizarUsuarioSchema = crearUsuarioSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: "No hay campos para actualizar",
});
