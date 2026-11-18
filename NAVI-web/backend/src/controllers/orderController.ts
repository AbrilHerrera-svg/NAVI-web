import type { Request, Response } from "express";
import { listarPedidos, buscarPedido, crearPedido, actualizarPedido } from "../models/orderModel";

export const getPedidos = async (_req: Request, res: Response) => {
  try {
    res.json(await listarPedidos());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const getPedido = async (req: Request, res: Response) => {
  try {
    const pedido = await buscarPedido(req.params.id);
    if (!pedido) {
      res.status(404).json({ mensaje: "Pedido no encontrado" });
      return;
    }
    res.json(pedido);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postPedido = async (req: Request, res: Response) => {
  try {
    const pedido = await crearPedido(req.body);
    res.status(201).json(pedido);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Cambia estado, método de pago, etc. — un solo endpoint de actualización
// parcial, igual que users/menu.
export const putPedido = async (req: Request, res: Response) => {
  try {
    await actualizarPedido(req.params.id, req.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
