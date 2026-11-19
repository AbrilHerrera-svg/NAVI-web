import { peticionAuth } from "../../auth";
import type { MenuItem, UpdateMenuItemPayload } from "../types";

// GET /api/menu
// Los productos pueden venir sin algún campo (se capturaron a mano en Firestore),
// así que se completan los que la pantalla necesita para no romper la tabla.
export const obtenerMenu = async (): Promise<MenuItem[]> => {
  const productos = await peticionAuth<MenuItem[]>("/menu");

  return productos.map((producto) => ({
    ...producto,
    prepTime: producto.prepTime ?? "",
    available: producto.available !== false,
    status: producto.status ?? "Activo",
  }));
};

// PUT /api/menu/:id  (cambia disponibilidad y/o estado: Activo, Inactivo, Archivado)
export const actualizarProducto = (id: string, cambios: UpdateMenuItemPayload) =>
  peticionAuth<{ ok: boolean }>(`/menu/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(cambios),
  });
