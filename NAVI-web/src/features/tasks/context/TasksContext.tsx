import { useState, type ReactNode } from 'react';
import { todayISO } from '../../../lib/date';
import { mockTasks } from '../data/tasksMock';
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
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const createTask = (input: TaskInput) => {
    setTasks((prev) => [...prev, { ...normalize(input), id: `t-${Date.now()}`, date: todayISO(), done: false }]);
  };

  const updateTask = (id: string, input: TaskInput) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...normalize(input) } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <TasksReactContext.Provider value={{ tasks, createTask, updateTask, deleteTask, toggleTask }}>
      {children}
    </TasksReactContext.Provider>
  );
};