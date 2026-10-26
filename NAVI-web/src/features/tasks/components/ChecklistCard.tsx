import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import ProgressBar from '../../../components/ui/ProgressBar';
import { formatTime12, getChecklistStatus, sortByDueTime, type ChecklistStatus, type Task } from '../types';
import { TaskCheckbox } from './TaskCheckbox';

interface Props {
  title: string;
  tasks: Task[];
  assigneeName: (id: string) => string;
  onToggle: (id: string) => void;
}

const statusColor: Record<ChecklistStatus, 'success' | 'info' | 'neutral'> = {
  Completado: 'success',
  'En progreso': 'info',
  Pendiente: 'neutral',
};

export const ChecklistCard = ({ title, tasks, assigneeName, onToggle }: Props) => {
  const done = tasks.filter((t) => t.done).length;
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
  const status = getChecklistStatus(tasks);

  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-base text-slate-800">{title}</h3>
        <Badge color={statusColor[status]}>{status}</Badge>
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
        <span>
          {done} de {tasks.length} completadas
        </span>
        <span className="font-bold text-[#5960A1]">{percent}%</span>
      </div>
      <ProgressBar value={percent} />

      <ul className="mt-4 divide-y divide-slate-100 border border-slate-100 rounded-lg">
        {sortByDueTime(tasks).map((task) => (
          <li key={task.id} className="flex items-center gap-3 px-3 py-2.5">
            <TaskCheckbox checked={task.done} label={task.name} onToggle={() => onToggle(task.id)} />
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-medium truncate ${task.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {task.name}
              </p>
              <p className="text-[11px] text-slate-400">
                {assigneeName(task.assigneeId)} · {formatTime12(task.dueTime)}
              </p>
            </div>
          </li>
        ))}
        {tasks.length === 0 && <li className="px-3 py-4 text-center text-xs text-slate-400">Sin tareas.</li>}
      </ul>
    </Card>
  );
};