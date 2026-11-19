import { peticionAuth } from "../../auth";
import type { Task } from "../types";

// GET /api/tasks?date=yyyy-mm-dd — las tareas de un día
export const obtenerTareas = (fecha: string) => peticionAuth<Task[]>(`/tasks?date=${fecha}`);
