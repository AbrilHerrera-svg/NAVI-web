// Fechas compartidas por toda la app: una sola fuente para "hoy" y sus formatos,
// para que ningún texto o filtro quede desincronizado del resto (ej. el encabezado del
// Dashboard mostrando una fecha fija mientras Inventario usa la fecha real del sistema).

// Fecha ISO (yyyy-mm-dd) del momento real actual.
export const todayISO = () => new Date().toISOString().slice(0, 10);

const monthAbbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// "2026-10-17" → "17 Oct 2026"
export const formatIsoDateEs = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return `${String(day).padStart(2, '0')} ${monthAbbrev[month - 1]} ${year}`;
};

// new Date() → "Sábado, 26 de octubre"
export const formatLongDateEs = (date: Date) => {
  const label = date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
};
