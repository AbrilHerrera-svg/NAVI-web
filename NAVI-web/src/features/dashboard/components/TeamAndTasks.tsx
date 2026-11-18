import type { ShiftItem, TaskItem, TaskStatus } from "../types";

const taskStatusStyles: Record<TaskStatus, { label: string; className: string }> = {
  completed: { label: "Completado", className: "text-emerald-600 font-semibold" },
  pending: { label: "Pendiente", className: "text-amber-600 font-semibold" },
  blocked: { label: "Bloqueado", className: "text-slate-400 font-medium" },
};

interface Props {
  tasks: TaskItem[];
  cleaningSummary: string;
  shift: ShiftItem[];
}

export const TeamAndTasks = ({ tasks, cleaningSummary, shift }: Props) => {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Equipo y tareas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tareas de hoy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-slate-800">Tareas de hoy</h3>
            <p className="text-[11px] text-slate-400">{cleaningSummary}</p>
          </div>
          {tasks.length === 0 ? (
            <p className="text-xs text-slate-400">No hay tareas para hoy.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                  <span className="text-slate-700">{task.label}</span>
                  <span className={taskStatusStyles[task.status].className}>
                    {taskStatusStyles[task.status].label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Turno de hoy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-800 mb-4">Turno de hoy</h3>
          {shift.length === 0 ? (
            <p className="text-xs text-slate-400">No hay usuarios con turno asignado.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {shift.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-2">
                  <span className="text-slate-700">{item.role}</span>
                  {item.active ? (
                    <span className="text-emerald-600 font-semibold shrink-0">En turno</span>
                  ) : (
                    <span className="text-slate-500 font-medium shrink-0">{item.detail}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
