export type TaskCategory = 'Apertura' | 'Cierre' | 'Limpieza' | 'General';
export type TaskRepeat = 'Todos los días' | 'Entre semana' | 'Una vez';
export type ChecklistStatus = 'Completado' | 'En progreso' | 'Pendiente';

export const TASK_CATEGORIES: TaskCategory[] = ['Apertura', 'Cierre', 'Limpieza', 'General'];
export const TASK_REPEATS: TaskRepeat[] = ['Todos los días', 'Entre semana', 'Una vez'];
export const REMINDER_OPTIONS = [0, 10, 15, 30, 60]; // minutos antes; 0 = sin recordatorio

export interface Task {
  id: string;
  date: string; // ISO yyyy-mm-dd
  name: string;
  description: string;
  category: TaskCategory;
  area?: string; // solo Limpieza: Cocina, Barra, Mesas, Baños
  requiredForClose: boolean;
  assigneeId: string; // id de features/users
  dueTime: string; // HH:mm, 24 h (viene de un <input type="time">)
  repeat: TaskRepeat;
  reminderMinutes: number;
  done: boolean;
}

export type TaskInput = Omit<Task, 'id' | 'date' | 'done'>;

// Solo dueño, encargado y cajero crean, editan y eliminan tareas; el resto solo las marca.
export const canManageTasks = (role: string) => ['Dueño', 'Encargado', 'Cajero'].includes(role);

// "21:30" → "9:30 p. m."
export const formatTime12 = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const suffix = h < 12 ? 'a. m.' : 'p. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
};

export const getChecklistStatus = (tasks: Task[]): ChecklistStatus => {
  const done = tasks.filter((t) => t.done).length;
  if (tasks.length > 0 && done === tasks.length) return 'Completado';
  if (done > 0) return 'En progreso';
  return 'Pendiente';
};

export const sortByDueTime = (tasks: Task[]) => [...tasks].sort((a, b) => a.dueTime.localeCompare(b.dueTime));

export const formatReminder = (minutes: number) => (minutes === 0 ? 'Sin recordatorio' : `${minutes} min antes`);