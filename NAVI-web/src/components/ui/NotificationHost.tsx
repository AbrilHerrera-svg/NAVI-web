import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Button from "./Button";
import {
  dismissToast,
  useNotifications,
  type NotifyType,
  type Toast,
} from "./notify";

const styles: Record<
  NotifyType,
  { icon: LucideIcon; label: string; card: string; iconBox: string; bar: string }
> = {
  success: {
    icon: CheckCircle2,
    label: "Listo",
    card: "border-emerald-200",
    iconBox: "bg-emerald-100 text-emerald-600",
    bar: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    label: "Algo salió mal",
    card: "border-rose-200",
    iconBox: "bg-rose-100 text-rose-600",
    bar: "bg-rose-500",
  },
  warning: {
    icon: AlertTriangle,
    label: "Atención",
    card: "border-amber-200",
    iconBox: "bg-amber-100 text-amber-600",
    bar: "bg-amber-500",
  },
  info: {
    icon: Info,
    label: "Aviso",
    card: "border-indigo-200",
    iconBox: "bg-indigo-50 text-[#5960A1]",
    bar: "bg-[#5960A1]",
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const { icon: Icon, label, card, iconBox, bar } = styles[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration]);

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={`navi-toast-in relative overflow-hidden w-full bg-white rounded-xl border ${card} shadow-lg shadow-slate-900/10 pointer-events-auto`}
    >
      <div className="flex items-start gap-3 p-3.5 pr-9">
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconBox}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{toast.title ?? label}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed break-words">
            {toast.message}
          </p>
        </div>
      </div>

      <button
        onClick={() => dismissToast(toast.id)}
        aria-label="Cerrar aviso"
        className="absolute top-2.5 right-2.5 text-slate-300 hover:text-slate-500 transition cursor-pointer"
      >
        <X size={14} />
      </button>

      {/* Barra que se vacía mientras corre el tiempo del aviso */}
      <div
        className={`navi-toast-bar absolute bottom-0 left-0 h-0.5 ${bar}`}
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </div>
  );
}

function ConfirmDialog() {
  const { confirm } = useNotifications();

  useEffect(() => {
    if (!confirm) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") confirm.resolve(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirm]);

  if (!confirm) return null;

  const danger = confirm.variant === "danger";

  return (
    <div
      className="navi-fade-in fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={() => confirm.resolve(false)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="navi-pop-in w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            danger ? "bg-rose-100 text-rose-600" : "bg-indigo-50 text-[#5960A1]"
          }`}
        >
          {danger ? <AlertTriangle size={22} /> : <Info size={22} />}
        </div>
        <h3 className="text-base font-bold text-slate-800">{confirm.title}</h3>
        {confirm.message && (
          <p className="text-xs text-slate-500 leading-relaxed">{confirm.message}</p>
        )}
        <div className="flex gap-3 w-full pt-2">
          <Button
            variant="secondary"
            onClick={() => confirm.resolve(false)}
            className="flex-1 py-2 px-3"
          >
            {confirm.cancelLabel ?? "Cancelar"}
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={() => confirm.resolve(true)}
            className="flex-1 py-2 px-3"
            autoFocus
          >
            {confirm.confirmLabel ?? "Aceptar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Se monta una sola vez en App: dibuja los avisos y el diálogo de confirmación.
export default function NotificationHost() {
  const { toasts } = useNotifications();

  return (
    <>
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[120] flex flex-col gap-2.5 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
      <ConfirmDialog />
    </>
  );
}