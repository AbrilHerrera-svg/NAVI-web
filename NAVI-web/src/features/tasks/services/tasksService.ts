import { apiFetch } from '../../../lib/api';
import type { Task, TaskInput } from '../types';

interface TaskApi extends Omit<Task, 'area' | 'description'> {
  area?: string;
  description?: string;
}

// El backend guarda área vacía "" cuando la tarea no es de Limpieza
const fromApi = (t: TaskApi): Task => ({
  ...t,
  description: t.description ?? '',
  area: t.area || undefined,
});

const toApi = (input: TaskInput) => ({
  name: input.name,
  description: input.description,
  category: input.category,
  area: input.area ?? '',
  requiredForClose: input.requiredForClose,
  assigneeId: input.assigneeId,
  dueTime: input.dueTime,
  repeat: input.repeat,
  reminderMinutes: input.reminderMinutes,
});

export const listTasksApi = async (date: string): Promise<Task[]> =>
  (await apiFetch<TaskApi[]>(`/tasks?date=${date}`)).map(fromApi);

export const createTaskApi = async (date: string, input: TaskInput): Promise<Task> =>
  fromApi(await apiFetch<TaskApi>('/tasks', { method: 'POST', body: { date, ...toApi(input) } }));

export const updateTaskApi = async (id: string, input: TaskInput): Promise<void> => {
  await apiFetch(`/tasks/${id}`, { method: 'PUT', body: toApi(input) });
};

export const setTaskDoneApi = async (id: string, done: boolean): Promise<void> => {
  await apiFetch(`/tasks/${id}`, { method: 'PUT', body: { done } });
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
};