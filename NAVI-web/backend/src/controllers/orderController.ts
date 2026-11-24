import type { Request, Response } from "express";
import {
  listarPedidos,
  buscarPedido,
  crearPedido,
  actualizarPedido,
  listarPedidosPorCliente,
} from "../models/orderModel";
import { buscarUsuarioPorUid } from "../models/userModel";
import { enviarNotificacion, mensajePorEstadoPedido } from "../services/notificaciones";

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
// parcial, igual que users/menu. Si cambia el estado y el pedido es de un
// cliente de la app (tiene customerUid), le avisamos por push.
export const putPedido = async (req: Request, res: Response) => {
  try {
    const pedidoAntes = req.body.status
      ? ((await buscarPedido(req.params.id)) as { customerUid?: string; orderNumber?: string } | null)
      : null;

    await actualizarPedido(req.params.id, req.body);

    if (req.body.status && pedidoAntes?.customerUid) {
      const cliente = await buscarUsuarioPorUid(pedidoAntes.customerUid);
      if (cliente?.fcmToken) {
        await enviarNotificacion(
          cliente.fcmToken,
          `Pedido ${pedidoAntes.orderNumber ?? ""}`.trim(),
          mensajePorEstadoPedido(req.body.status)
        );
      }
    }

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Mensaje manual del staff a UN pedido (no una promoción a todos). Solo
// sirve si el pedido es de un cliente de la app (tiene customerUid y token).
export const postNotificarPedido = async (req: Request, res: Response) => {
  try {
    const pedido = (await buscarPedido(req.params.id)) as { customerUid?: string } | null;
    if (!pedido) {
      res.status(404).json({ mensaje: "Pedido no encontrado" });
      return;
    }

    if (!pedido.customerUid) {
      res.status(400).json({ mensaje: "Este pedido no es de un cliente de la app" });
      return;
    }

    const cliente = await buscarUsuarioPorUid(pedido.customerUid);
    if (!cliente?.fcmToken) {
      res.status(400).json({ mensaje: "El cliente no tiene notificaciones activas" });
      return;
    }

    await enviarNotificacion(cliente.fcmToken, req.body.title, req.body.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
