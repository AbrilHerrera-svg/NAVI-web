// Cancún está en UTC-5 todo el año (no tiene horario de verano).
const OFFSET_HORAS = -5;
const MS_HORA = 60 * 60 * 1000;
const MS_DIA = 24 * MS_HORA;

// Inicio (00:00 hora Cancún) del día que contiene a "fecha", como Date en UTC.
export const inicioDelDia = (fecha: Date = new Date()): Date => {
  const local = fecha.getTime() + OFFSET_HORAS * MS_HORA; // "reloj" de Cancún
  const inicioLocal = Math.floor(local / MS_DIA) * MS_DIA;
  return new Date(inicioLocal - OFFSET_HORAS * MS_HORA);
};

export const sumarDias = (fecha: Date, dias: number): Date =>
  new Date(fecha.getTime() + dias * MS_DIA);

// Hora (0-23) en Cancún
export const horaLocal = (fecha: Date): number =>
  new Date(fecha.getTime() + OFFSET_HORAS * MS_HORA).getUTCHours();

// Día de la semana en Cancún (0 = domingo ... 6 = sábado)
export const diaSemanaLocal = (fecha: Date): number =>
  new Date(fecha.getTime() + OFFSET_HORAS * MS_HORA).getUTCDay();

// Lunes 00:00 (Cancún) de la semana que contiene a "fecha"
export const inicioDeSemana = (fecha: Date = new Date()): Date => {
  const dia = diaSemanaLocal(fecha); // 0 = domingo
  const diasDesdeLunes = (dia + 6) % 7;
  return sumarDias(inicioDelDia(fecha), -diasDesdeLunes);
};

// Día del mes (1-31) en Cancún
export const diaDelMesLocal = (fecha: Date): number =>
  new Date(fecha.getTime() + OFFSET_HORAS * MS_HORA).getUTCDate();

// Día 1 del mes a las 00:00 (Cancún) del mes que contiene a "fecha"
export const inicioDelMes = (fecha: Date = new Date()): Date => {
  const local = new Date(fecha.getTime() + OFFSET_HORAS * MS_HORA);
  const inicioLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1);
  return new Date(inicioLocal - OFFSET_HORAS * MS_HORA);
};
