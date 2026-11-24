import { z } from "zod";

export const crearExtraSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    price: z.number().nonnegative(),
    available: z.boolean(),
  })
  .strict();

export const actualizarExtraSchema = crearExtraSchema
  .partial()
  .refine((datos) => Object.keys(datos).length > 0, { message: "No hay campos para actualizar" });
