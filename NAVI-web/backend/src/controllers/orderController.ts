import type { Request, Response } from "express";
import {
  listarPedidos,
  buscarPedido,
  crearPedido,
  actualizarPedido,
  listarPedidosPorCliente,
} from "../models/orderModel";

export const getPedidos = async (_req: Request, res: Response) => {
  try {
    res.json(await listarPedidos());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Pedidos del cliente que llama (la app móvil): solo los suyos, filtrados
// por su propio uid de Firebase Auth, nunca por un id que mande el cliente.
export const getMisPedidos = async (req: Request, res: Response) => {
  try {
    res.json(await listarPedidosPorCliente(req.uid!));
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
    // Solo los pedidos creados desde la app quedan ligados al uid del
    // cliente; los de mostrador los registra el staff y no tienen dueño.
    const customerUid = req.body.origin === "App" ? req.uid : undefined;
    const pedido = await crearPedido(req.body, customerUid);
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
