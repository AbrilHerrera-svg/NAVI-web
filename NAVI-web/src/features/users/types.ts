export type UserRole = 'Dueño' | 'Encargado' | 'Cajero' | 'Barista' | 'Cocina';
export type UserStatus = 'Activo' | 'Inactivo';
export type UserShift = 'Matutino' | 'Vespertino';

export const USER_ROLES: UserRole[] = ['Dueño', 'Encargado', 'Cajero', 'Barista', 'Cocina'];
export const USER_SHIFTS: UserShift[] = ['Matutino', 'Vespertino'];

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  shift: UserShift;
}

export type UserInput = Omit<TeamUser, 'id'>;

export interface UserActionResult {
  ok: boolean;
  reason?: string;
}

// Horario de cada turno, en horas de 24 h. Una sola fuente para la tabla, el formulario
// y la tarjeta de "Turno de hoy".
export const SHIFT_HOURS: Record<UserShift, { start: number; end: number }> = {
  Matutino: { start: 7, end: 15 },
  Vespertino: { start: 15, end: 23 },
};

const hourLabel = (hour: number) => {
  const suffix = hour < 12 ? 'a. m.' : 'p. m.';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:00 ${suffix}`;
};

export const formatShift = (shift: UserShift) =>
  `${shift} · ${hourLabel(SHIFT_HOURS[shift].start)} – ${hourLabel(SHIFT_HOURS[shift].end)}`;

// "En turno", "Inicia 3:00 p. m." o "Terminó"
export const getShiftStatus = (shift: UserShift, hour: number) => {
  const { start, end } = SHIFT_HOURS[shift];
  if (hour >= start && hour < end) return { active: true, label: 'En turno' };
  if (hour < start) return { active: false, label: `Inicia ${hourLabel(start)}` };
  return { active: false, label: 'Terminó' };
};

// Solo el dueño administra usuarios.
export const canManageUsers = (role: string) => role === 'Dueño';

// Iniciales para el avatar de la tabla
export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());