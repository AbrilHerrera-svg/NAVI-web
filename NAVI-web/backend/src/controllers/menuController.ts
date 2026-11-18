import type { Request, Response } from "express";
import {
  listarMenu,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../models/menuModel";

export const getMenu = async (_req: Request, res: Response) => {
  try {
    res.json(await listarMenu());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postProducto = async (req: Request, res: Response) => {
  try {
    const producto = await crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const putProducto = async (req: Request, res: Response) => {
  try {
    await actualizarProducto(req.params.id, req.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  try {
    await eliminarProducto(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
