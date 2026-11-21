import { apiFetch } from '../../../lib/api';
import type { TeamUser, UserInput, UserRole } from '../types';

// Usuario tal como lo guarda el backend (rol en minúsculas, como en Firestore)
interface UserApi {
  id: string;
  name?: string;
  nombre?: string;
  email: string;
  role?: string;
  rol?: string;
  status?: TeamUser['status'];
  shift?: TeamUser['shift'];
}

const roleFromApi = (role: string): UserRole => {
  switch (role.toLowerCase()) {
    case 'admin':
    case 'dueño':
      return 'Dueño';
    case 'barista':
      return 'Barista';
    case 'cocina':
      return 'Cocina';
    default:
      return 'Cajero';
  }
};

const roleToApi: Record<UserRole, string> = {
  Dueño: 'admin',
  Cajero: 'cajero',
  Barista: 'barista',
  Cocina: 'cocina',
};

const fromApi = (u: UserApi): TeamUser => ({
  id: u.id,
  name: u.name ?? u.nombre ?? u.email,
  email: u.email,
  role: roleFromApi(u.role ?? u.rol ?? ''),
  status: u.status ?? 'Activo',
  shift: u.shift ?? 'Matutino',
});

const toApi = (input: UserInput) => ({
  name: input.name,
  email: input.email,
  role: roleToApi[input.role],
  status: input.status,
  shift: input.shift,
});

export const listUsersApi = async (): Promise<TeamUser[]> =>
  (await apiFetch<UserApi[]>('/users')).map(fromApi);

export const createUserApi = async (input: UserInput): Promise<TeamUser> =>
  fromApi(await apiFetch<UserApi>('/users', { method: 'POST', body: toApi(input) }));

export const updateUserApi = async (id: string, input: UserInput): Promise<void> => {
  await apiFetch(`/users/${id}`, { method: 'PUT', body: toApi(input) });
};

export const setUserStatusApi = async (id: string, status: TeamUser['status']): Promise<void> => {
  await apiFetch(`/users/${id}`, { method: 'PUT', body: { status } });
};