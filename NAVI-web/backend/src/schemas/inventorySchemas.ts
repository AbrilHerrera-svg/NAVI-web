import { z } from "zod";

export const crearIngredienteSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    unit: z.string().trim().min(1).max(30),
    unitsPerBox: z.number().positive(),
    costPerBox: z.number().nonnegative(),
    minStock: z.number().nonnegative(),
    initialStock: z.number().nonnegative(),
  })
  .strict();

export const actualizarIngredienteSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    unit: z.string().trim().min(1).max(30),
    unitsPerBox: z.number().positive(),
    costPerBox: z.number().nonnegative(),
    minStock: z.number().nonnegative(),
  })
  .strict();

const isoDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (yyyy-mm-dd)");

export const registrarAjusteSchema = z
  .object({
    ingredientId: z.string().trim().min(1).max(200),
    type: z.enum(["Ajuste", "Merma"]),
    countedBoxes: z.number().nonnegative(),
    notes: z.string().trim().max(500).optional().default(""),
    responsible: z.string().trim().min(1).max(120),
    date: isoDate,
    reason: z.string().trim().max(200).optional().default(""),
    reference: z.string().trim().max(200).optional().default(""),
  })
  .strict();

export const registrarCompraSchema = z
  .object({
    ingredientId: z.string().trim().min(1).max(200),
    receivedBoxes: z.number().positive(),
    totalCost: z.number().nonnegative(),
    notes: z.string().trim().max(500).optional().default(""),
    supplier: z.string().trim().min(1).max(120),
    date: isoDate,
    paymentMethod: z.string().trim().min(1).max(60),
  })
  .strict();
