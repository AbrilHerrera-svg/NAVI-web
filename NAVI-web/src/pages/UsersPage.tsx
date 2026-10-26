import { useState } from 'react';
import {
  UsersHeader,
  UsersTableView,
  UserFormModal,
  DeactivateUserModal,
  TodayShiftCard,
  AssignedTasksCard,
  canManageUsers,
  useUsers,
  type AssignedTasksItem,
  type TeamUser,
} from '../features/users';
import { useTasks } from '../features/tasks';
import { useSession } from '../features/profile';

export default function UsersPage() {
  const { users, createUser, updateUser, setUserStatus } = useUsers();
  const { tasks } = useTasks();
  const { profile } = useSession();
  const canManage = canManageUsers(profile.role);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<TeamUser | null>(null);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  const pendingTasksOf = (userId: string) => tasks.filter((t) => t.assigneeId === userId && !t.done).length;

  const assignedItems: AssignedTasksItem[] = users
    .filter((u) => u.status === 'Activo')
    .map((u) => {
      const own = tasks.filter((t) => t.assigneeId === u.id);
      return { userId: u.id, name: u.name, role: u.role, done: own.filter((t) => t.done).length, total: own.length };
    })
    .filter((item) => item.total > 0);

  const handleRequestDeactivate = (user: TeamUser) => {
    setDeactivateTarget(user);
    setBlockedReason(null);
  };

  const handleConfirmDeactivate = () => {
    if (!deactivateTarget) return;
    const result = setUserStatus(deactivateTarget.id, 'Inactivo');
    if (!result.ok) {
      setBlockedReason(result.reason ?? 'No se pudo desactivar.');
      return;
    }
    setDeactivateTarget(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <UsersHeader
        canManage={canManage}
        onAddUser={() => {
          setEditingUser(null);
          setIsFormOpen(true);
        }}
      />

      <UsersTableView
        users={users}
        currentUserEmail={profile.email}
        canManage={canManage}
        onEdit={(user) => {
          setEditingUser(user);
          setIsFormOpen(true);
        }}
        onDeactivate={handleRequestDeactivate}
        onActivate={(user) => setUserStatus(user.id, 'Activo')}
      />

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-800">Equipo hoy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TodayShiftCard users={users} currentHour={new Date().getHours()} />
          <AssignedTasksCard items={assignedItems} />
        </div>
      </section>

      <UserFormModal
        key={isFormOpen ? (editingUser?.id ?? 'new') : 'closed'}
        isOpen={isFormOpen}
        user={editingUser}
        onClose={() => setIsFormOpen(false)}
        onCreate={createUser}
        onUpdate={updateUser}
      />

      <DeactivateUserModal
        user={deactivateTarget}
        pendingTasks={deactivateTarget ? pendingTasksOf(deactivateTarget.id) : 0}
        blockedReason={blockedReason}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}