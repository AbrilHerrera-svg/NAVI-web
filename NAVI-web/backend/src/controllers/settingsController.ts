import type { Request, Response } from "express";
import {
  obtenerNegocio,
  actualizarNegocio,
  obtenerNotificaciones,
  actualizarNotificaciones,
} from "../models/settingsModel";

export const getNegocio = async (_req: Request, res: Response) => {
  try {
    res.json(await obtenerNegocio());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const putNegocio = async (req: Request, res: Response) => {
  try {
    await actualizarNegocio(req.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const getNotificaciones = async (_req: Request, res: Response) => {
  try {
    res.json(await obtenerNotificaciones());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const putNotificaciones = async (req: Request, res: Response) => {
  try {
    await actualizarNotificaciones(req.body.items);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
