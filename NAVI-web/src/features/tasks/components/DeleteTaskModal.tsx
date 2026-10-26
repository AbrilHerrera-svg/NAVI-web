import Button from '../../../components/ui/Button';
import type { Task } from '../types';

interface Props {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteTaskModal = ({ task, onClose, onConfirm }: Props) => {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-slate-800">¿Eliminar esta tarea?</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          “{task.name}” se quitará de la lista
          {task.repeat !== 'Una vez' ? ' y de sus próximas repeticiones' : ''}. Esta acción no se puede deshacer; las
          demás tareas no cambian.
        </p>
        <div className="flex gap-3 w-full pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
            Mantener tarea
          </Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1 py-2 px-3">
            Sí, eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};