import type { Request, Response } from "express";
import { buscarReceta, guardarReceta, listarRecetas } from "../models/recipeModel";

export const getRecetas = async (_req: Request, res: Response) => {
  try {
    res.json(await listarRecetas());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const getReceta = async (req: Request, res: Response) => {
  try {
    res.json(await buscarReceta(req.params.productId));
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const putReceta = async (req: Request, res: Response) => {
  try {
    await guardarReceta(req.params.productId, req.body.lines);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};