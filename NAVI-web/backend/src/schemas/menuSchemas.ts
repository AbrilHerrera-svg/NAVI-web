import { z } from "zod";

export const crearProductoSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    category: z.string().trim().min(1).max(60),
    priceSingle: z.number().nonnegative(),
    prepTime: z.string().trim().max(30),
    available: z.boolean(),
    status: z.enum(["Activo", "Inactivo", "Archivado"]),
  })
  .strict();

export const actualizarProductoSchema = crearProductoSchema.partial().refine((datos) => Object.keys(datos).length > 0, {
  message: "No hay campos para actualizar",
});
