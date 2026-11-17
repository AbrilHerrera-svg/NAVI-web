import { z } from "zod";

const lineaSchema = z
  .object({
    ingredientId: z.string().trim().min(1).max(200),
    amountSingle: z.number().nonnegative(),
  })
  .strict();

export const guardarRecetaSchema = z
  .object({
    lines: z.array(lineaSchema).max(100),
  })
  .strict();
