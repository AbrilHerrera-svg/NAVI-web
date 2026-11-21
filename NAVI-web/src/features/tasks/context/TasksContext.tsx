import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { errorMessage } from '../../../lib/api';
import { todayISO } from '../../../lib/date';
import {
  createTaskApi,
  deleteTaskApi,
  listTasksApi,
  setTaskDoneApi,
  updateTaskApi,
} from '../services/tasksService';
import type { Task, TaskInput } from '../types';
import { TasksReactContext } from './useTasks';

// Solo Limpieza usa área; si la categoría cambia, se descarta para no dejar datos huérfanos.
const normalize = (input: TaskInput): TaskInput => ({
  ...input,
  name: input.name.trim(),
  description: input.description.trim(),
  area: input.category === 'Limpieza' ? input.area?.trim() || undefined : undefined,
});

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const reload = useCallback(async () => {
    try {
      setTasks(await listTasksApi(todayISO()));
    } catch (error) {
      console.warn('No se pudieron cargar las tareas:', error);
    }
  }, []);

  // carga inicial al abrir la app
  useEffect(() => {
    listTasksApi(todayISO())
      .then(setTasks)
      .catch((error) => console.warn('No se pudieron cargar las tareas:', error));
  }, []);

  // El cambio se ve al instante y se guarda en el servidor; si falla, se avisa
  // y se vuelve a cargar la lista real.
  const onSaveError = (error: unknown) => {
    alert(`No se pudo guardar en el servidor: ${errorMessage(error)}`);
    void reload();
  };

  const createTask = (input: TaskInput) => {
    const clean = normalize(input);
    const date = todayISO();
    const tempId = `tmp-${Date.now()}`;
    setTasks((prev) => [...prev, { ...clean, id: tempId, date, done: false }]);

    createTaskApi(date, clean)
      .then((saved) => setTasks((prev) => prev.map((t) => (t.id === tempId ? saved : t))))
      .catch(onSaveError);
  };

  const updateTask = (id: string, input: TaskInput) => {
    const clean = normalize(input);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...clean } : t)));
    updateTaskApi(id, clean).catch(onSaveError);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    deleteTaskApi(id).catch(onSaveError);
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const done = !task.done;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)));
    setTaskDoneApi(id, done).catch(onSaveError);
  };

  return (
    <TasksReactContext.Provider value={{ tasks, createTask, updateTask, deleteTask, toggleTask }}>
      {children}
    </TasksReactContext.Provider>
  );
};