import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

interface Props {
  dateLabel: string;
  sessionLabel: string; // ej. "Ana García · Dueño"
  canManage: boolean;
  onNewTask: () => void;
}

export const TasksHeader = ({ dateLabel, sessionLabel, canManage, onNewTask }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tareas</h1>
        <p className="text-xs text-slate-400 mt-0.5">{dateLabel} · Apertura, cierre y limpieza</p>
      </div>

      <div className="flex items-center gap-2">
        <Badge color="brand">{sessionLabel}</Badge>
        {canManage && <Button onClick={onNewTask}>Nueva tarea</Button>}
      </div>
    </div>
  );
};