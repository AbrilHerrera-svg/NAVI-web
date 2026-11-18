import { z } from "zod";

const productoSchema = z
  .object({
    id: z.string().trim().min(1).max(200),
    name: z.string().trim().min(1).max(120),
    category: z.enum(["Bebidas", "Cocina", "Postres"]),
    categoryLabel: z.string().trim().min(1).max(60),
    size: z.string().trim().max(30).optional(),
    price: z.number().nonnegative(),
  })
  .strict();

const extraSchema = z
  .object({
    extraId: z.string().trim().min(1).max(200),
    name: z.string().trim().min(1).max(120),
    price: z.number().nonnegative(),
    quantity: z.number().int().positive(),
  })
  .strict();

const cartItemSchema = z
  .object({
    product: productoSchema,
    quantity: z.number().int().positive(),
    extras: z.array(extraSchema).max(50),
    prepared: z.boolean().optional(),
  })
  .strict();

export const crearPedidoSchema = z
  .object({
    origin: z.enum(["App", "Mostrador"]),
    receivedTime: z.string().trim().max(30),
    dueTime: z.string().trim().max(30),
    customerName: z.string().trim().max(120).optional(),
    productsSummary: z.string().trim().max(500),
    total: z.number().nonnegative(),
    paymentMethod: z.enum(["Efectivo", "Terminal de tarjeta", "Transferencia"]).optional(),
    cart: z.array(cartItemSchema).max(100).optional(),
  })
  .strict();

export const actualizarPedidoSchema = z
  .object({
    status: z.enum(["Nuevo", "En preparación", "Listo", "Recogido", "Cancelado"]).optional(),
    paymentMethod: z.enum(["Efectivo", "Terminal de tarjeta", "Transferencia"]).optional(),
    customerName: z.string().trim().max(120).optional(),
    cart: z.array(cartItemSchema).max(100).optional(),
  })
  .strict()
  .refine((datos) => Object.keys(datos).length > 0, { message: "No hay campos para actualizar" });
