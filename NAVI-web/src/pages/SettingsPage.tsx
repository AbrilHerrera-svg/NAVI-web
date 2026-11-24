import { useEffect, useState } from "react";
import {
  BusinessInfoCard,
  NotificationsCard,
  obtenerNegocio,
  actualizarNegocio,
  obtenerNotificaciones,
  actualizarNotificaciones,
  type BusinessInfo,
  type NotificationSetting,
} from "../features/settings";
import { errorMessage } from "../lib/api";

export default function SettingsPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [notifications, setNotifications] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([obtenerNegocio(), obtenerNotificaciones()])
      .then(([negocio, notifs]) => {
        if (cancelled) return;
        setBusinessInfo(negocio);
        setNotifications(notifs);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleNotification = (id: string) => {
    const anterior = notifications;
    const actualizadas = notifications.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n));
    setNotifications(actualizadas);

    actualizarNotificaciones(actualizadas).catch((err) => {
      setNotifications(anterior);
      alert(`No se pudo guardar: ${errorMessage(err)}`);
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-xs text-slate-400 mt-0.5">Datos del negocio y preferencias</p>
      </div>

      {loading && <p className="text-sm text-slate-400">Cargando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {businessInfo && (
        <BusinessInfoCard
          info={businessInfo}
          onSave={(updated) => {
            setBusinessInfo(updated);
            actualizarNegocio(updated)
              .then(() => alert("Información guardada"))
              .catch((err) => alert(`No se pudo guardar: ${errorMessage(err)}`));
          }}
        />
      )}

      {!loading && (
        <NotificationsCard items={notifications} onToggle={handleToggleNotification} />
      )}
    </div>
  );
}
