import type { Request, Response } from "express";
import { buscarSesion, abrirSesion, cerrarSesion, ultimoCierre } from "../models/cashRegisterModel";

// GET /api/cash-register?date=yyyy-mm-dd — una sesión por día.
export const getSesion = async (req: Request, res: Response) => {
  try {
    const fecha = (req.query.date as string) ?? new Date().toISOString().slice(0, 10);
    const sesion = await buscarSesion(fecha);
    if (!sesion) {
      res.status(404).json({ mensaje: "No hay caja abierta ese día" });
      return;
    }
    res.json(sesion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postAbrir = async (req: Request, res: Response) => {
  try {
    const { date, ...datos } = req.body;
    const sesion = await abrirSesion(date, datos);
    res.status(201).json(sesion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postCerrar = async (req: Request, res: Response) => {
  try {
    await cerrarSesion(req.params.id, req.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// GET /api/cash-register/last-close
export const getUltimoCierre = async (_req: Request, res: Response) => {
  try {
    res.json(await ultimoCierre());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};