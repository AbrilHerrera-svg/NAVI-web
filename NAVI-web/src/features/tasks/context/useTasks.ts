import { createContext, useContext } from 'react';
import type { Task, TaskInput } from '../types';

export interface TasksContextValue {
  tasks: Task[];
  createTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

export const TasksReactContext = createContext<TasksContextValue | null>(null);

// Tareas del día compartidas: Tareas las administra y Usuarios muestra el avance por persona.
export const useTasks = () => {
  const ctx = useContext(TasksReactContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de <TasksProvider>');
  return ctx;
};