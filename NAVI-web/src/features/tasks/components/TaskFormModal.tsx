import { useState, type FormEvent } from 'react';
import Button from '../../../components/ui/Button';
import type { TeamUser } from '../../users/types';
import {
  REMINDER_OPTIONS,
  TASK_CATEGORIES,
  TASK_REPEATS,
  formatReminder,
  type Task,
  type TaskCategory,
  type TaskInput,
  type TaskRepeat,
} from '../types';

interface Props {
  isOpen: boolean;
  // Si viene una tarea, el modal edita; si no, crea una nueva.
  task: Task | null;
  // Personas a las que se puede asignar (solo usuarios activos).
  assignees: TeamUser[];
  onClose: () => void;
  onCreate: (input: TaskInput) => void;
  onUpdate: (id: string, input: TaskInput) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]';

const CLEANING_AREAS = ['Cocina', 'Barra', 'Mesas', 'Baños'];

// El padre debe remontar este componente (key={task?.id ?? 'new'}) al cambiar de tarea
// o entre crear/editar, igual que IngredientFormModal.
export const TaskFormModal = ({ isOpen, task, assignees, onClose, onCreate, onUpdate }: Props) => {
  const [name, setName] = useState(task?.name ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [category, setCategory] = useState<TaskCategory>(task?.category ?? 'Apertura');
  const [area, setArea] = useState(task?.area ?? CLEANING_AREAS[0]);
  const [requiredForClose, setRequiredForClose] = useState(task?.requiredForClose ?? false);
  // Si la persona asignada ya no está activa, se pide elegir a alguien más.
  const [assigneeId, setAssigneeId] = useState(
    task && assignees.some((u) => u.id === task.assigneeId) ? task.assigneeId : ''
  );
  const [dueTime, setDueTime] = useState(task?.dueTime ?? '');
  const [repeat, setRepeat] = useState<TaskRepeat>(task?.repeat ?? 'Todos los días');
  const [reminderMinutes, setReminderMinutes] = useState(task?.reminderMinutes ?? 10);

  if (!isOpen) return null;

  const canSave = name.trim().length > 0 && assigneeId !== '' && dueTime !== '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const input: TaskInput = {
      name,
      description,
      category,
      area: category === 'Limpieza' ? area : undefined,
      // Las tareas de cierre siempre cuentan para cerrar el día.
      requiredForClose: category === 'Cierre' ? true : requiredForClose,
      assigneeId,
      dueTime,
      repeat,
      reminderMinutes,
    };

    if (task) {
      onUpdate(task.id, input);
    } else {
      onCreate(input);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-base font-bold text-slate-800">{task ? 'Editar tarea' : 'Nueva tarea'}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {task
              ? 'Los cambios aplican a esta tarea y a sus próximas repeticiones.'
              : 'Aparecerá en su categoría con la hora límite y la persona asignada.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la tarea</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Limpiar la máquina de espresso"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Qué hay que hacer</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Instrucciones breves para quien la realiza"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className={`${inputClass} bg-white`}
              >
                {TASK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {category === 'Limpieza' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Área</label>
                <select value={area} onChange={(e) => setArea(e.target.value)} className={`${inputClass} bg-white`}>
                  {CLEANING_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requerida para cerrar el día</label>
                <select
                  value={category === 'Cierre' || requiredForClose ? 'si' : 'no'}
                  onChange={(e) => setRequiredForClose(e.target.value === 'si')}
                  disabled={category === 'Cierre'}
                  className={`${inputClass} bg-white disabled:bg-slate-50 disabled:text-slate-400`}
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Asignar a</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className={`${inputClass} bg-white`}
              >
                <option value="" disabled>
                  Elige una persona
                </option>
                {assignees.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} · {u.role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hora límite</label>
              <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Repetir</label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as TaskRepeat)}
                className={`${inputClass} bg-white`}
              >
                {TASK_REPEATS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Recordatorio</label>
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className={`${inputClass} bg-white`}
              >
                {REMINDER_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {formatReminder(m)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1 py-2">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!canSave}
              className="flex-1 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {task ? 'Guardar cambios' : 'Crear tarea'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};