import { createContext, useContext } from 'react';
import type { TeamUser, UserActionResult, UserInput } from '../types';

export interface UsersContextValue {
  users: TeamUser[];
  // Crear y editar validan correo duplicado y que siempre quede un dueño activo;
  // regresan el motivo en vez de fallar en silencio.
  createUser: (input: UserInput) => UserActionResult;
  updateUser: (id: string, input: UserInput) => UserActionResult;
  setUserStatus: (id: string, status: TeamUser['status']) => UserActionResult;
}

export const UsersReactContext = createContext<UsersContextValue | null>(null);

// Lista del equipo compartida: Usuarios la administra y Tareas la usa para asignar.
export const useUsers = () => {
  const ctx = useContext(UsersReactContext);
  if (!ctx) throw new Error('useUsers debe usarse dentro de <UsersProvider>');
  return ctx;
};