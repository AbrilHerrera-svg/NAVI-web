import { z } from "zod";

const lineaSchema = z
  .object({
    ingredientId: z.string().trim().min(1).max(200),
    // consumo por tamaño: mediano, grande o único (extras y productos sin tamaño)
    amountMed: z.number().nonnegative().optional(),
    amountGde: z.number().nonnegative().optional(),
    amountSingle: z.number().nonnegative().optional(),
  })
  .strict();

export const guardarRecetaSchema = z
  .object({
    lines: z.array(lineaSchema).max(100),
  })
  .strict();