import { useState } from 'react';
import * as Icons from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { USER_ROLES, formatShift, getInitials, type TeamUser, type UserRole } from '../types';

interface Props {
  users: TeamUser[];
  currentUserEmail: string;
  canManage: boolean;
  onEdit: (user: TeamUser) => void;
  onDeactivate: (user: TeamUser) => void;
  onActivate: (user: TeamUser) => void;
}

const selectClass =
  'px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5960A1] cursor-pointer';

export const UsersTableView = ({ users, currentUserEmail, canManage, onEdit, onDeactivate, onActivate }: Props) => {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'Todos'>('Todos');

  const q = query.trim().toLowerCase();
  const visible = users.filter(
    (u) =>
      (roleFilter === 'Todos' || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  );
  const activeCount = users.filter((u) => u.status === 'Activo').length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Miembros del equipo</h2>
          <p className="text-[11px] text-slate-400">
            {activeCount} activos · {users.length - activeCount} inactivos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'Todos')}
            className={selectClass}
          >
            <option value="Todos">Todos los roles</option>
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="relative">
            <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar nombre o correo"
              className="w-56 pl-8 pr-3 py-2 rounded-lg bg-slate-100 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#5960A1]/30"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Rol</th>
              <th className="py-3 px-4">Turno</th>
              <th className="py-3 px-4">Estado</th>
              {canManage && <th className="py-3 px-4 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {visible.map((user) => {
              const isActive = user.status === 'Activo';
              const isMe = user.email === currentUserEmail;
              // Atenúa los datos de usuarios inactivos, pero no las acciones.
              const dim = isActive ? '' : 'opacity-50';
              return (
                <tr key={user.id} className="hover:bg-slate-50/70 transition">
                  <td className={`py-3 px-4 ${dim}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#EEF0FB] text-[#5960A1] flex items-center justify-center text-[11px] font-bold shrink-0">
                        {getInitials(user.name)}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">
                          {user.name}
                          {isMe && <span className="ml-1.5 text-[10px] font-medium text-slate-400">(tú)</span>}
                        </p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-slate-800 ${dim}`}>{user.role}</td>
                  <td className={`py-3 px-4 text-slate-500 ${dim}`}>{formatShift(user.shift)}</td>
                  <td className="py-3 px-4">
                    <Badge color={isActive ? 'success' : 'neutral'}>{user.status}</Badge>
                  </td>
                  {canManage && (
                    <td className="py-3 px-4 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => onEdit(user)}
                        className="text-xs font-medium text-[#5960A1] hover:underline cursor-pointer"
                      >
                        Editar
                      </button>
                      {isActive ? (
                        <button
                          onClick={() => onDeactivate(user)}
                          className="text-xs font-medium text-rose-500 hover:underline cursor-pointer"
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          onClick={() => onActivate(user)}
                          className="text-xs font-medium text-emerald-600 hover:underline cursor-pointer"
                        >
                          Activar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="py-8 text-center text-slate-400">
                  No hay usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="m-4 mt-0 pt-4 border-t border-slate-100">
        <div className="flex items-start gap-2 bg-[#EEF0FB] text-[#454B80] rounded-lg px-3 py-2.5 text-[11px]">
          <Icons.Info size={14} className="shrink-0 mt-px" />
          <span>
            El único dueño activo no se puede desactivar ni cambiar de rol. Agrega otro dueño antes de cambiar su
            acceso. Desactivar conserva el historial de pedidos y tareas del usuario.
          </span>
        </div>
      </div>
    </div>
  );
};