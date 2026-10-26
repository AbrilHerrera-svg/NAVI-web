import { useState, type ReactNode } from 'react';
import { mockUsers } from '../data/usersMock';
import type { TeamUser, UserActionResult, UserInput } from '../types';
import { UsersReactContext } from './useUsers';

const LAST_OWNER_REASON =
  'Es el único dueño activo. Agrega o activa otro dueño antes de cambiar su acceso.';

// Verdadero si, tras aplicar el cambio, no quedaría ningún dueño activo.
const leavesNoActiveOwner = (users: TeamUser[], id: string, next: Pick<TeamUser, 'role' | 'status'>) =>
  !users.some((u) => {
    const role = u.id === id ? next.role : u.role;
    const status = u.id === id ? next.status : u.status;
    return role === 'Dueño' && status === 'Activo';
  });

const emailTaken = (users: TeamUser[], email: string, exceptId?: string) =>
  users.some((u) => u.id !== exceptId && u.email.toLowerCase() === email.trim().toLowerCase());

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<TeamUser[]>(mockUsers);

  const createUser = (input: UserInput): UserActionResult => {
    if (emailTaken(users, input.email)) {
      return { ok: false, reason: 'Ya existe un usuario con ese correo.' };
    }
    setUsers((prev) => [
      ...prev,
      { ...input, id: `u-${Date.now()}`, name: input.name.trim(), email: input.email.trim() },
    ]);
    return { ok: true };
  };

  const updateUser = (id: string, input: UserInput): UserActionResult => {
    if (emailTaken(users, input.email, id)) {
      return { ok: false, reason: 'Ya existe un usuario con ese correo.' };
    }
    if (leavesNoActiveOwner(users, id, input)) {
      return { ok: false, reason: LAST_OWNER_REASON };
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...input, name: input.name.trim(), email: input.email.trim() } : u))
    );
    return { ok: true };
  };

  const setUserStatus = (id: string, status: TeamUser['status']): UserActionResult => {
    const user = users.find((u) => u.id === id);
    if (!user) return { ok: false, reason: 'El usuario ya no existe.' };
    if (leavesNoActiveOwner(users, id, { role: user.role, status })) {
      return { ok: false, reason: LAST_OWNER_REASON };
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    return { ok: true };
  };

  return (
    <UsersReactContext.Provider value={{ users, createUser, updateUser, setUserStatus }}>
      {children}
    </UsersReactContext.Provider>
  );
};