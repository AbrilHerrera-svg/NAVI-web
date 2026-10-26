import Button from '../../../components/ui/Button';
import type { TeamUser } from '../types';

interface Props {
  user: TeamUser | null;
  pendingTasks: number;
  // Motivo por el que no se puede desactivar (null = sí se puede, pide confirmación normal).
  blockedReason: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeactivateUserModal = ({ user, pendingTasks, blockedReason, onClose, onConfirm }: Props) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {blockedReason ? (
          <>
            <h3 className="text-base font-bold text-slate-800">No se puede desactivar a {user.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{blockedReason}</p>
            <Button variant="secondary" onClick={onClose} className="w-full py-2 px-3">
              Entendido
            </Button>
          </>
        ) : (
          <>
            <h3 className="text-base font-bold text-slate-800">¿Desactivar a {user.name}?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ya no podrá iniciar sesión. Su historial se conserva y puedes activarlo de nuevo cuando quieras.
              {pendingTasks > 0 &&
                ` Tiene ${pendingTasks} ${pendingTasks === 1 ? 'tarea pendiente' : 'tareas pendientes'} hoy; reasígnalas en Tareas.`}
            </p>
            <div className="flex gap-3 w-full pt-2">
              <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
                Mantener activo
              </Button>
              <Button variant="danger" onClick={onConfirm} className="flex-1 py-2 px-3">
                Sí, desactivar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};