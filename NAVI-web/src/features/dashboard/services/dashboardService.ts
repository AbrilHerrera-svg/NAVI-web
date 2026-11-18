import { lastDaysISO } from "../../../lib/date";
import { obtenerCaja } from "../../cash-register";
import { obtenerIngredientes } from "../../inventory";
import { obtenerMenu } from "../../menu";
import { obtenerPedidos } from "../../orders";
import { obtenerTareas } from "../../tasks";
import { obtenerUsuarios } from "../../users";
import type { DashboardSource } from "../types";

// Pide al backend todo lo que necesita el inicio, en paralelo.
// incluirFinanzas: solo el dueño ve "Ventas y dinero", así que solo a él se le piden
// las cajas de los últimos 7 días; a los demás solo la de hoy.
export const obtenerDatosDashboard = async (incluirFinanzas: boolean): Promise<DashboardSource> => {
  const dias = lastDaysISO(incluirFinanzas ? 7 : 1); // el último día es hoy
  const hoy = dias[dias.length - 1];

  const [orders, ingredients, menu, tasks, users, cajas] = await Promise.all([
    obtenerPedidos(),
    obtenerIngredientes(),
    obtenerMenu(),
    obtenerTareas(hoy),
    obtenerUsuarios(),
    Promise.all(dias.map((dia) => obtenerCaja(dia))),
  ]);

  return {
    orders,
    ingredients,
    menu,
    tasks,
    users,
    cashToday: cajas[cajas.length - 1],
    cashWeek: cajas.filter((caja) => caja !== null),
  };
};
