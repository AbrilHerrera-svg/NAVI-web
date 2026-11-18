import { z } from "zod";

const isoDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (yyyy-mm-dd)");

export const abrirSesionSchema = z
  .object({
    date: isoDate,
    openedBy: z.string().trim().min(1).max(120),
    initialFund: z.number().nonnegative(),
  })
  .strict();

export const cerrarSesionSchema = z
  .object({
    cashCounted: z.number().nonnegative(),
    terminalCounted: z.number().nonnegative(),
    transferCounted: z.number().nonnegative(),
    difference: z.number(),
    reason: z.string().trim().max(300).optional(),
  })
  .strict();
