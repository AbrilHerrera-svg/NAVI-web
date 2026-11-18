import type { Request, Response } from "express";
import { listarTareas, crearTarea, actualizarTarea, eliminarTarea } from "../models/taskModel";

// GET /api/tasks?date=yyyy-mm-dd — la checklist siempre es de un día puntual.
export const getTareas = async (req: Request, res: Response) => {
  try {
    const fecha = (req.query.date as string) ?? new Date().toISOString().slice(0, 10);
    res.json(await listarTareas(fecha));
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postTarea = async (req: Request, res: Response) => {
  try {
    const { date, ...datos } = req.body;
    const tarea = await crearTarea(date, datos);
    res.status(201).json(tarea);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const putTarea = async (req: Request, res: Response) => {
  try {
    await actualizarTarea(req.params.id, req.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const deleteTarea = async (req: Request, res: Response) => {
  try {
    await eliminarTarea(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
