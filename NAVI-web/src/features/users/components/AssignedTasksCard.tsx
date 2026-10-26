import Card from '../../../components/ui/Card';
import ProgressBar from '../../../components/ui/ProgressBar';

export interface AssignedTasksItem {
  userId: string;
  name: string;
  role: string;
  done: number;
  total: number;
}

interface Props {
  items: AssignedTasksItem[];
}

// Avance de tareas de hoy por persona. Recibe los conteos ya calculados para no depender
// del módulo de Tareas.
export const AssignedTasksCard = ({ items }: Props) => {
  return (
    <Card>
      <h3 className="font-semibold text-sm text-slate-800 mb-4">Tareas asignadas hoy</h3>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400">Nadie tiene tareas asignadas hoy.</p>
      ) : (
        <div className="space-y-3 text-xs">
          {items.map((item) => {
            const complete = item.done === item.total;
            return (
              <div key={item.userId} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">
                    {item.name} <span className="text-slate-400">· {item.role}</span>
                  </span>
                  <span className={complete ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                    {item.done} de {item.total}
                  </span>
                </div>
                <ProgressBar value={(item.done / item.total) * 100} tone={complete ? 'solid' : 'medium'} />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};