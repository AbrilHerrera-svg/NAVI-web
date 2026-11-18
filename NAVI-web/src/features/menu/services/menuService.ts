import { peticionAuth } from "../../auth";
import type { MenuItem } from "../types";

// GET /api/menu
export const obtenerMenu = () => peticionAuth<MenuItem[]>("/menu");
