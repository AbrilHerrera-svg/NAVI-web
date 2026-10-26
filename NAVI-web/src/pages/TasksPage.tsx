import { useState } from 'react';
import {
  TasksHeader,
  ChecklistCard,
  TasksTableView,
  CloseDayBanner,
  CleaningCard,
  TaskFormModal,
  DeleteTaskModal,
  canManageTasks,
  useTasks,
  type Task,
} from '../features/tasks';
import { TodayShiftCard, useUsers } from '../features/users';
import { useSession } from '../features/profile';
import { formatLongDateEs } from '../lib/date';

interface TasksPageProps {
  onNavigateToCashRegister: () => void;
}

export default function TasksPage({ onNavigateToCashRegister }: TasksPageProps) {
  const { tasks, createTask, updateTask, deleteTask, toggleTask } = useTasks();
  const { users } = useUsers();
  const { profile } = useSession();
  const canManage = canManageTasks(profile.role);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const assigneeName = (id: string) => users.find((u) => u.id === id)?.name ?? 'Sin asignar';
  const activeUsers = users.filter((u) => u.status === 'Activo');

  const opening = tasks.filter((t) => t.category === 'Apertura');
  const closing = tasks.filter((t) => t.category === 'Cierre');
  const cleaning = tasks.filter((t) => t.category === 'Limpieza');
  const pendingRequired = tasks.filter((t) => t.requiredForClose && !t.done).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <TasksHeader
        dateLabel={formatLongDateEs(new Date())}
        sessionLabel={`${profile.name} · ${profile.role}`}
        canManage={canManage}
        onNewTask={() => {
          setEditingTask(null);
          setIsFormOpen(true);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChecklistCard title="Apertura" tasks={opening} assigneeName={assigneeName} onToggle={toggleTask} />
        <ChecklistCard title="Cierre" tasks={closing} assigneeName={assigneeName} onToggle={toggleTask} />
      </div>

      <TasksTableView
        tasks={tasks}
        assigneeName={assigneeName}
        canManage={canManage}
        onToggle={toggleTask}
        onEdit={(task) => {
          setEditingTask(task);
          setIsFormOpen(true);
        }}
        onDelete={setDeleteTarget}
      />

      <CloseDayBanner pendingRequired={pendingRequired} onGoToCashRegister={onNavigateToCashRegister} />

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-800">Limpieza y turnos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CleaningCard tasks={cleaning} />
          <TodayShiftCard users={users} currentHour={new Date().getHours()} />
        </div>
      </section>

      <TaskFormModal
        key={isFormOpen ? (editingTask?.id ?? 'new') : 'closed'}
        isOpen={isFormOpen}
        task={editingTask}
        assignees={activeUsers}
        onClose={() => setIsFormOpen(false)}
        onCreate={createTask}
        onUpdate={updateTask}
      />

      <DeleteTaskModal
        task={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteTask(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}