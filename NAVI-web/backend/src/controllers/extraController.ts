import type { Request, Response } from "express";
import { listarExtras, crearExtra, actualizarExtra, eliminarExtra } from "../models/extraModel";

export const getExtras = async (_req: Request, res: Response) => {
  try {
    res.json(await listarExtras());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postExtra = async (req: Request, res: Response) => {
  try {
    const extra = await crearExtra(req.body);
    res.status(201).json(extra);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const putExtra = async (req: Request, res: Response) => {
  try {
    await actualizarExtra(req.params.id, req.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const deleteExtra = async (req: Request, res: Response) => {
  try {
    await eliminarExtra(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
