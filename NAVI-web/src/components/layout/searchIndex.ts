import type { PageId } from "./Sidebar";

// Una opción que puede encontrar el buscador del Topbar.
// page: a qué pantalla lleva · sectionId: id del bloque al que hace scroll (si tiene).
export interface SearchEntry {
  label: string;
  group: string; // texto pequeño que indica dónde está
  keywords: string[]; // otras palabras con las que también se encuentra
  page: PageId;
  sectionId?: string;
}

// Para agregar más resultados: añade una entrada aquí y, si apunta a una sección,
// ponle ese mismo id a su bloque en la página (ej. <div id="dashboard-alertas">).
// Primero van las páginas y luego las secciones: a igual coincidencia, sale antes la página.
const entries: SearchEntry[] = [
  { label: "Inicio", group: "Página", keywords: ["dashboard", "resumen", "home"], page: "dashboard" },
  { label: "Ventas", group: "Página", keywords: ["ingresos", "reporte de ventas", "productos más vendidos"], page: "sales" },
  { label: "Pedidos", group: "Página", keywords: ["órdenes", "ordenes", "cobrar", "kanban", "cancelar pedido"], page: "orders" },
  { label: "Nuevo pedido", group: "Página", keywords: ["crear pedido", "tomar orden", "carrito", "extras"], page: "new-order" },
  { label: "Menú", group: "Página", keywords: ["productos", "carta", "precios", "categorías"], page: "menu" },
  { label: "Caja", group: "Página", keywords: ["efectivo", "cierre de caja", "fondo inicial", "arqueo", "reembolsos"], page: "cash-register" },
  { label: "Inventario", group: "Página", keywords: ["ingredientes", "stock", "existencias", "compras", "merma", "movimientos"], page: "inventory" },
  { label: "Tareas", group: "Página", keywords: ["checklist", "apertura", "cierre", "limpieza", "pendientes"], page: "tasks" },
  { label: "Usuarios", group: "Página", keywords: ["equipo", "empleados", "personal", "roles", "turnos"], page: "users" },
  { label: "Mi perfil", group: "Página", keywords: ["cuenta", "contraseña", "seguridad", "mis datos"], page: "profile" },
  { label: "Configuración", group: "Página", keywords: ["negocio", "notificaciones", "ajustes", "horario"], page: "settings" },

  { label: "Requiere atención ahora", group: "Inicio", keywords: ["alertas", "urgente", "prioridad"], page: "dashboard", sectionId: "dashboard-alertas" },
  { label: "Métricas rápidas", group: "Inicio", keywords: ["ventas de hoy", "ticket promedio", "utilidad", "resumen de hoy", "resumen de la semana"], page: "dashboard", sectionId: "dashboard-metricas" },
  { label: "Operación en vivo", group: "Inicio", keywords: ["cola de pedidos", "pedidos atrasados", "en preparación"], page: "dashboard", sectionId: "dashboard-operacion" },
  { label: "Productos e inventario", group: "Inicio", keywords: ["más vendidos", "productos agotados", "ingredientes bajo mínimo", "compras sugeridas"], page: "dashboard", sectionId: "dashboard-inventario" },
  { label: "Equipo y tareas", group: "Inicio", keywords: ["tareas de hoy", "turno de hoy", "limpieza por área"], page: "dashboard", sectionId: "dashboard-equipo" },
  { label: "Ventas y dinero", group: "Inicio", keywords: ["ventas por hora", "métodos de pago", "ingresos vs gastos", "gastos de hoy"], page: "dashboard", sectionId: "dashboard-finanzas" },
];

// Quita acentos y mayúsculas para que "menu" encuentre "Menú".
export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// 3: el título empieza con lo escrito · 2: lo contiene · 1: coincide una palabra clave · 0: no coincide
const scoreEntry = (entry: SearchEntry, query: string) => {
  const label = normalizeText(entry.label);
  if (label.startsWith(query)) return 3;
  if (label.includes(query)) return 2;
  return entry.keywords.some((keyword) => normalizeText(keyword).includes(query)) ? 1 : 0;
};

export const searchEntries = (text: string, limit = 6): SearchEntry[] => {
  const query = normalizeText(text);
  if (!query) return [];

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((result) => result.entry);
};
