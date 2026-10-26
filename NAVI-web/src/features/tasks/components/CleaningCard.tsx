import Card from '../../../components/ui/Card';
import type { Task } from '../types';

interface Props {
  tasks: Task[]; // solo tareas de Limpieza
}

export const CleaningCard = ({ tasks }: Props) => {
  return (
    <Card>
      <h3 className="font-semibold text-sm text-slate-800 mb-4">Limpieza por área</h3>
      {tasks.length === 0 ? (
        <p className="text-xs text-slate-400">No hay tareas de limpieza hoy.</p>
      ) : (
        <div className="space-y-3 text-xs">
          {tasks.map((task) => (
            <div key={task.id} className="flex justify-between items-center">
              <span className="text-slate-700">{task.area ?? task.name}</span>
              <span className={task.done ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                {task.done ? 'Listo' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};