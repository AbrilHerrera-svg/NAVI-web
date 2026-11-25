import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().trim().email().max(200),
    password: z.string().min(1).max(200),
  })
  .strict();

export const recuperarSchema = z
  .object({
    email: z.string().trim().email().max(200),
  })
  .strict();

export const refreshSchema = z
  .object({
    refreshToken: z.string().trim().min(10).max(2000),
  })
  .strict();

export const registerSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    phone: z.string().trim().min(1).max(30).optional(),
  })
  .strict();

export const fcmTokenSchema = z
  .object({
    token: z.string().trim().min(10).max(4096),
  })
  .strict();

export const actualizarPerfilSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    phone: z.string().trim().min(1).max(30),
  })
  .partial()
  .strict()
  .refine((datos) => Object.keys(datos).length > 0, { message: "No hay campos para actualizar" });
