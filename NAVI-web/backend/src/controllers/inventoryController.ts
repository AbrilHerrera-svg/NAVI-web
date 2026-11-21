import type { Request, Response } from "express";
import {
  listarIngredientes,
  crearIngrediente,
  actualizarIngrediente,
  eliminarIngrediente,
  listarMovimientos,
  registrarAjuste,
  registrarCompra,
  registrarConsumo,
  ExistenciasInsuficientes,
} from "../models/inventoryModel";

export const getIngredientes = async (_req: Request, res: Response) => {
  try {
    res.json(await listarIngredientes());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postIngrediente = async (req: Request, res: Response) => {
  try {
    const ingrediente = await crearIngrediente(req.body);
    res.status(201).json(ingrediente);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const putIngrediente = async (req: Request, res: Response) => {
  try {
    await actualizarIngrediente(req.params.id, req.body);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const deleteIngrediente = async (req: Request, res: Response) => {
  try {
    await eliminarIngrediente(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const getMovimientos = async (_req: Request, res: Response) => {
  try {
    res.json(await listarMovimientos());
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postAjuste = async (req: Request, res: Response) => {
  try {
    const id = await registrarAjuste(req.body);
    res.status(201).json({ id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postCompra = async (req: Request, res: Response) => {
  try {
    const id = await registrarCompra(req.body);
    res.status(201).json({ id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const postConsumo = async (req: Request, res: Response) => {
  try {
    await registrarConsumo(req.body);
    res.status(201).json({ ok: true });
  } catch (error) {
    if (error instanceof ExistenciasInsuficientes) {
      res.status(409).json({ mensaje: "Existencias insuficientes", faltantes: error.faltantes });
      return;
    }
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};