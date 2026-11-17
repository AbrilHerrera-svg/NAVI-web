import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().trim().email().max(200),
    password: z.string().min(1).max(200),
  })
  .strict();

export const refreshSchema = z
  .object({
    refreshToken: z.string().trim().min(10).max(2000),
  })
  .strict();
