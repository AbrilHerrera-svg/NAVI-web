import { useState } from 'react';
import * as Icons from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { formatIsoDateEs } from '../../../lib/date';
import { TASK_CATEGORIES, formatTime12, sortByDueTime, type Task, type TaskCategory } from '../types';
import { TaskCheckbox } from './TaskCheckbox';

interface Props {
  tasks: Task[];
  assigneeName: (id: string) => string;
  canManage: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const selectClass =
  'px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5960A1] cursor-pointer';

export const TasksTableView = ({ tasks, assigneeName, canManage, onToggle, onEdit, onDelete }: Props) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<TaskCategory | 'Todas'>('Todas');

  const q = query.trim().toLowerCase();
  const visible = sortByDueTime(tasks).filter(
    (t) =>
      (category === 'Todas' || t.category === category) &&
      (t.name.toLowerCase().includes(q) || assigneeName(t.assigneeId).toLowerCase().includes(q))
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-800">Todas las tareas</h2>
        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory | 'Todas')}
            className={selectClass}
          >
            <option value="Todas">Todas las categorías</option>
            {TASK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="relative">
            <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar tarea o persona"
              className="w-56 pl-8 pr-3 py-2 rounded-lg bg-slate-100 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#5960A1]/30"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4 w-10" />
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Tarea</th>
              <th className="py-3 px-4">Asignado</th>
              <th className="py-3 px-4">Hora límite</th>
              <th className="py-3 px-4">Estado</th>
              {canManage && <th className="py-3 px-4 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {visible.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-4">
                  <TaskCheckbox checked={task.done} label={task.name} onToggle={() => onToggle(task.id)} />
                </td>
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{formatIsoDateEs(task.date)}</td>
                <td className="py-3 px-4 text-slate-500">
                  {task.category}
                  {task.area ? ` · ${task.area}` : ''}
                </td>
                <td className="py-3 px-4">
                  <p className={task.done ? 'text-slate-400 line-through' : 'font-bold text-slate-900'}>{task.name}</p>
                  {task.requiredForClose && (
                    <p className="text-[10px] text-slate-400 mt-0.5">Requerida para cerrar el día</p>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-800">{assigneeName(task.assigneeId)}</td>
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{formatTime12(task.dueTime)}</td>
                <td className="py-3 px-4">
                  <Badge color={task.done ? 'success' : 'warning'}>{task.done ? 'Completada' : 'Pendiente'}</Badge>
                </td>
                {canManage && (
                  <td className="py-3 px-4 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => onEdit(task)}
                      className="text-xs font-medium text-[#5960A1] hover:underline cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(task)}
                      className="text-xs font-medium text-rose-500 hover:underline cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={canManage ? 8 : 7} className="py-8 text-center text-slate-400">
                  No hay tareas que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-400">
        Mostrando {visible.length} de {tasks.length} tareas · Solo dueño, encargado y cajero pueden crear, editar y
        eliminar tareas.
      </p>
    </div>
  );
};