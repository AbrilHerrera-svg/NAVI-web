import { useState, type FormEvent } from 'react';
import Button from '../../../components/ui/Button';
import {
  USER_ROLES,
  USER_SHIFTS,
  formatShift,
  isValidEmail,
  type TeamUser,
  type UserActionResult,
  type UserInput,
  type UserRole,
  type UserShift,
  type UserStatus,
} from '../types';

interface Props {
  isOpen: boolean;
  // Si viene un usuario, el modal edita; si no, crea uno nuevo.
  user: TeamUser | null;
  onClose: () => void;
  onCreate: (input: UserInput) => UserActionResult;
  onUpdate: (id: string, input: UserInput) => UserActionResult;
}

const inputClass =
  'w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]';

// El padre debe remontar este componente (key={user?.id ?? 'new'}) al cambiar de usuario
// o entre crear/editar, igual que IngredientFormModal, para recalcular los valores iniciales.
export const UserFormModal = ({ isOpen, user, onClose, onCreate, onUpdate }: Props) => {
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'Barista');
  const [shift, setShift] = useState<UserShift>(user?.shift ?? 'Matutino');
  const [status, setStatus] = useState<UserStatus>(user?.status ?? 'Activo');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const emailOk = isValidEmail(email);
  const canSave = name.trim().length > 0 && emailOk;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const input: UserInput = { name, email, role, shift, status };
    const result = user ? onUpdate(user.id, input) : onCreate(input);
    if (!result.ok) {
      setError(result.reason ?? 'No se pudo guardar.');
      return;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-base font-bold text-slate-800">{user ? 'Editar usuario' : 'Agregar usuario'}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {user
              ? 'Los cambios de rol aplican desde su próximo inicio de sesión.'
              : 'Recibirá una invitación por correo para crear su contraseña.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Elena Canul"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="ej. elena@navi.cafe"
              className={inputClass}
            />
            {email.length > 0 && !emailOk && (
              <p className="text-[11px] text-rose-500 mt-1">Escribe un correo válido.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rol</label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as UserRole);
                  setError(null);
                }}
                className={`${inputClass} bg-white`}
              >
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as UserStatus);
                  setError(null);
                }}
                className={`${inputClass} bg-white`}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Turno</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as UserShift)}
              className={`${inputClass} bg-white`}
            >
              {USER_SHIFTS.map((s) => (
                <option key={s} value={s}>
                  {formatShift(s)}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#EEF0FB] text-[#454B80] rounded-lg px-3 py-2.5 text-[11px] leading-relaxed">
            Dueño ve todo, incluida esta pantalla. Encargado y Cajero administran tareas y caja. Barista y Cocina
            ven pedidos y sus tareas asignadas.
          </div>

          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1 py-2">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!canSave}
              className="flex-1 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {user ? 'Guardar cambios' : 'Agregar usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};