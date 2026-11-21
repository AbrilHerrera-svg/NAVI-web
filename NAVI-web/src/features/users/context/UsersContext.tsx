import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { errorMessage } from '../../../lib/api';
import { createUserApi, listUsersApi, setUserStatusApi, updateUserApi } from '../services/usersService';
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
  const [users, setUsers] = useState<TeamUser[]>([]);

  const reload = useCallback(async () => {
    try {
      setUsers(await listUsersApi());
    } catch (error) {
      console.warn('No se pudieron cargar los usuarios:', error);
    }
  }, []);

  // carga inicial al abrir la app
  useEffect(() => {
    listUsersApi()
      .then(setUsers)
      .catch((error) => console.warn('No se pudieron cargar los usuarios:', error));
  }, []);

  // Las validaciones corren en el front con la lista cargada (respuesta inmediata);
  // el cambio se ve al instante y se guarda en el servidor. Si el servidor falla,
  // se avisa y se vuelve a cargar la lista real.
  const onSaveError = (error: unknown) => {
    alert(`No se pudo guardar en el servidor: ${errorMessage(error)}`);
    void reload();
  };

  const createUser = (input: UserInput): UserActionResult => {
    if (emailTaken(users, input.email)) {
      return { ok: false, reason: 'Ya existe un usuario con ese correo.' };
    }

    const clean = { ...input, name: input.name.trim(), email: input.email.trim() };
    const tempId = `tmp-${Date.now()}`;
    setUsers((prev) => [...prev, { ...clean, id: tempId }]);

    createUserApi(clean)
      .then((saved) => setUsers((prev) => prev.map((u) => (u.id === tempId ? saved : u))))
      .catch(onSaveError);

    return { ok: true };
  };

  const updateUser = (id: string, input: UserInput): UserActionResult => {
    if (emailTaken(users, input.email, id)) {
      return { ok: false, reason: 'Ya existe un usuario con ese correo.' };
    }
    if (leavesNoActiveOwner(users, id, input)) {
      return { ok: false, reason: LAST_OWNER_REASON };
    }

    const clean = { ...input, name: input.name.trim(), email: input.email.trim() };
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...clean } : u)));
    updateUserApi(id, clean).catch(onSaveError);

    return { ok: true };
  };

  const setUserStatus = (id: string, status: TeamUser['status']): UserActionResult => {
    const user = users.find((u) => u.id === id);
    if (!user) return { ok: false, reason: 'El usuario ya no existe.' };
    if (leavesNoActiveOwner(users, id, { role: user.role, status })) {
      return { ok: false, reason: LAST_OWNER_REASON };
    }

    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setUserStatusApi(id, status).catch(onSaveError);

    return { ok: true };
  };

  return (
    <UsersReactContext.Provider value={{ users, createUser, updateUser, setUserStatus }}>
      {children}
    </UsersReactContext.Provider>
  );
};