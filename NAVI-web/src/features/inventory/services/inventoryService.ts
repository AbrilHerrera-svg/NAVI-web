import { peticionAuth } from "../../auth";
import type { IngredientRecord } from "../types";

// GET /api/inventory/ingredients
export const obtenerIngredientes = () => peticionAuth<IngredientRecord[]>("/inventory/ingredients");
