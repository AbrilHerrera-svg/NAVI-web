import { mockTodayTasks, mockTodayShift } from "../data/dashboardMock";
import type { TaskStatus } from "../types";

const taskStatusStyles: Record<TaskStatus, { label: string; className: string }> = {
  completed: { label: "Completado", className: "text-emerald-600 font-semibold" },
  pending: { label: "Pendiente", className: "text-amber-600 font-semibold" },
  blocked: { label: "Bloqueado", className: "text-slate-400 font-medium" },
};

export const TeamAndTasks = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Equipo y tareas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tareas de hoy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-slate-800">Tareas de hoy</h3>
            <p className="text-[11px] text-slate-400">
              Limpieza por área: Cocina ✓ · Barra pendiente · Mesas ✓ · Baños ✓
            </p>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {mockTodayTasks.map((task, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                <span className="text-slate-700">{task.label}</span>
                <span className={taskStatusStyles[task.status].className}>
                  {taskStatusStyles[task.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Turno de hoy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-800 mb-4">Turno de hoy</h3>
          <div className="space-y-3 text-xs">
            {mockTodayShift.map((shift, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-slate-700">{shift.role}</span>
                {shift.active ? (
                  <span className="text-emerald-600 font-semibold">En turno</span>
                ) : (
                  <span className="text-slate-500 font-medium">{shift.detail}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};