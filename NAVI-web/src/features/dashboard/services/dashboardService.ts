import { lastDaysISO } from "../../../lib/date";
import { getSessionApi } from "../../cash-register";
import { listIngredientsApi } from "../../inventory";
import { obtenerMenu } from "../../menu";
import { obtenerPedidos } from "../../orders";
import { listTasksApi } from "../../tasks";
import { listUsersApi } from "../../users";
import type { DashboardSource } from "../types";

// Pide al backend todo lo que necesita el inicio, en paralelo.
// incluirFinanzas: solo el dueño ve "Ventas y dinero", así que solo a él se le piden
// las cajas de los últimos 7 días; a los demás solo la de hoy.
export const obtenerDatosDashboard = async (incluirFinanzas: boolean): Promise<DashboardSource> => {
  const dias = lastDaysISO(incluirFinanzas ? 7 : 1); // el último día es hoy
  const hoy = dias[dias.length - 1];

  const [orders, ingredients, menu, tasks, users, cajas] = await Promise.all([
    obtenerPedidos(),
    listIngredientsApi(),
    obtenerMenu(),
    listTasksApi(hoy),
    listUsersApi(),
    Promise.all(dias.map((dia) => getSessionApi(dia))),
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