import type { Request, Response } from "express";
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../models/userModel";

export const getUsuarios = async (_req: Request, res: Response) => {
  try {
    res.json(await listarUsuarios());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await crearUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const putUsuario = async (req: Request, res: Response) => {
  try {
    await actualizarUsuario(req.params.id, req.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    await eliminarUsuario(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
