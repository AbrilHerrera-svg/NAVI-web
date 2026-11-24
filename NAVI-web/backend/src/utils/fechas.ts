
const MS_DIA = 24 * 60 * 60 * 1000;

// Inicio (00:00 hora local del servidor) del día que contiene a "fecha".
export const inicioDelDia = (fecha: Date = new Date()): Date =>
  new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

export const sumarDias = (fecha: Date, dias: number): Date => new Date(fecha.getTime() + dias * MS_DIA);

// Hora (0-23) local del servidor
export const horaLocal = (fecha: Date): number => fecha.getHours();

// Día de la semana local del servidor (0 = domingo ... 6 = sábado)
export const diaSemanaLocal = (fecha: Date): number => fecha.getDay();

// Lunes 00:00 (hora local del servidor) de la semana que contiene a "fecha"
export const inicioDeSemana = (fecha: Date = new Date()): Date => {
  const dia = diaSemanaLocal(fecha); // 0 = domingo
  const diasDesdeLunes = (dia + 6) % 7;
  return sumarDias(inicioDelDia(fecha), -diasDesdeLunes);
};

// Día del mes (1-31) local del servidor
export const diaDelMesLocal = (fecha: Date): number => fecha.getDate();

// Día 1 del mes a las 00:00 (hora local del servidor) del mes que contiene a "fecha"
export const inicioDelMes = (fecha: Date = new Date()): Date => new Date(fecha.getFullYear(), fecha.getMonth(), 1);
