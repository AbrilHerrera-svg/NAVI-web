import Card from '../../../components/ui/Card';
import { getShiftStatus, type TeamUser } from '../types';

interface Props {
  users: TeamUser[];
  // Hora actual (0–23). La recibe del padre para que el render sea puro y se pueda probar.
  currentHour: number;
}

// Personal activo y si está en turno ahora. La usan Usuarios y Tareas.
export const TodayShiftCard = ({ users, currentHour }: Props) => {
  const active = users.filter((u) => u.status === 'Activo');

  return (
    <Card>
      <h3 className="font-semibold text-sm text-slate-800 mb-4">Turno de hoy</h3>
      <div className="space-y-3 text-xs">
        {active.map((user) => {
          const shift = getShiftStatus(user.shift, currentHour);
          return (
            <div key={user.id} className="flex justify-between items-center gap-3">
              <span className="text-slate-700">
                {user.role} · {user.name}
              </span>
              <span className={shift.active ? 'text-emerald-600 font-semibold' : 'text-slate-500 font-medium'}>
                {shift.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};