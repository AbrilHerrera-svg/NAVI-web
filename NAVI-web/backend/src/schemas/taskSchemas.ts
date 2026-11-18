import { z } from "zod";

const isoDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (yyyy-mm-dd)");

export const crearTareaSchema = z
  .object({
    date: isoDate,
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(500).optional().default(""),
    category: z.enum(["Apertura", "Cierre", "Limpieza", "General"]),
    area: z.string().trim().max(60).optional(),
    requiredForClose: z.boolean(),
    assigneeId: z.string().trim().min(1).max(200),
    dueTime: z
      .string()
      .trim()
      .regex(/^\d{2}:\d{2}$/, "Hora inválida (HH:mm)"),
    repeat: z.enum(["Todos los días", "Entre semana", "Una vez"]),
    reminderMinutes: z.number().int().nonnegative(),
  })
  .strict();

export const actualizarTareaSchema = crearTareaSchema
  .omit({ date: true })
  .partial()
  .extend({ done: z.boolean().optional() })
  .strict()
  .refine((datos) => Object.keys(datos).length > 0, { message: "No hay campos para actualizar" });
