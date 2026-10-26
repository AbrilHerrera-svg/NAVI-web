import { useState } from "react";
import {
  BusinessInfoCard,
  NotificationsCard,
  mockBusinessInfo,
  mockNotificationSettings,
  type BusinessInfo,
} from "../features/settings";

export default function SettingsPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(mockBusinessInfo);
  const [notifications, setNotifications] = useState(mockNotificationSettings);

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-xs text-slate-400 mt-0.5">Datos del negocio y preferencias</p>
      </div>

      <BusinessInfoCard
        info={businessInfo}
        onSave={(updated) => {
          setBusinessInfo(updated);
          alert("Información guardada");
        }}
      />

      <NotificationsCard
        items={notifications}
        onToggle={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
          )
        }
      />
    </div>
  );
}
