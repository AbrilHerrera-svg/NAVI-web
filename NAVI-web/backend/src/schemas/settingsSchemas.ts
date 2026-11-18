import { z } from "zod";

export const actualizarNegocioSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    address: z.string().trim().max(200),
    phone: z.string().trim().max(30),
    hours: z.string().trim().max(120),
  })
  .partial()
  .strict()
  .refine((datos) => Object.keys(datos).length > 0, { message: "No hay campos para actualizar" });

const notificacionSchema = z
  .object({
    id: z.string().trim().min(1).max(200),
    label: z.string().trim().min(1).max(120),
    description: z.string().trim().max(300),
    enabled: z.boolean(),
  })
  .strict();

export const actualizarNotificacionesSchema = z
  .object({
    items: z.array(notificacionSchema).max(100),
  })
  .strict();
