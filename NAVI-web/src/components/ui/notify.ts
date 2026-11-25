import { useSyncExternalStore } from "react";

// Sistema de notificaciones propio: reemplaza a alert() y confirm() del navegador.
// Se puede llamar desde cualquier parte (componentes, contextos, callbacks):
//   notify.success("Perfil actualizado");
//   notify.error("No se pudo guardar", "Error");
//   if (await confirmDialog({ title: "¿Cerrar sesión?" })) { ... }

export type NotifyType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  type: NotifyType;
  message: string;
  title?: string;
  duration: number;
}

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  // "danger" pinta el botón en rojo (para acciones destructivas)
  variant?: "primary" | "danger";
}

export interface ConfirmState extends ConfirmOptions {
  resolve: (accepted: boolean) => void;
}

interface State {
  toasts: Toast[];
  confirm: ConfirmState | null;
}

const MAX_TOASTS = 4;
const DEFAULT_DURATION: Record<NotifyType, number> = {
  success: 3500,
  info: 4000,
  warning: 5000,
  error: 6000,
};

let state: State = { toasts: [], confirm: null };
let nextId = 1;
const listeners = new Set<() => void>();

const setState = (next: State) => {
  state = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export const dismissToast = (id: number) => {
  setState({ ...state, toasts: state.toasts.filter((toast) => toast.id !== id) });
};

const push = (type: NotifyType, message: string, title?: string, duration?: number) => {
  const toast: Toast = {
    id: nextId++,
    type,
    message,
    title,
    duration: duration ?? DEFAULT_DURATION[type],
  };
  // Si hay demasiadas a la vez, se descartan las más viejas
  setState({ ...state, toasts: [...state.toasts, toast].slice(-MAX_TOASTS) });
  return toast.id;
};

export const notify = {
  success: (message: string, title?: string) => push("success", message, title),
  error: (message: string, title?: string) => push("error", message, title),
  warning: (message: string, title?: string) => push("warning", message, title),
  info: (message: string, title?: string) => push("info", message, title),
};

// Pregunta de sí/no con un diálogo propio; devuelve true si la persona acepta.
export const confirmDialog = (options: ConfirmOptions): Promise<boolean> =>
  new Promise((resolve) => {
    // Si ya había una pregunta abierta, se cancela antes de mostrar la nueva
    state.confirm?.resolve(false);
    setState({
      ...state,
      confirm: {
        ...options,
        resolve: (accepted) => {
          setState({ ...state, confirm: null });
          resolve(accepted);
        },
      },
    });
  });

export const useNotifications = () => useSyncExternalStore(subscribe, getSnapshot);