import { useEffect, useMemo, useState } from "react";
import { obtenerDatosDashboard } from "../services/dashboardService";
import type { DashboardPeriod, DashboardSource } from "../types";
import { buildDashboard } from "../utils/buildDashboard";

// Carga los datos del inicio una sola vez y calcula lo que se muestra según el periodo,
// así cambiar entre "Hoy" y "Esta semana" es instantáneo (no vuelve a pedir nada).
export const useDashboard = (period: DashboardPeriod, includeFinance: boolean) => {
  const [source, setSource] = useState<DashboardSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false; // evita actualizar el estado si el componente ya se cerró

    obtenerDatosDashboard(includeFinance)
      .then((datos) => {
        if (cancelled) return;
        setSource(datos);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar el inicio");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [includeFinance, reloadKey]);

  const data = useMemo(() => (source ? buildDashboard(source, period) : null), [source, period]);

  const reload = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  return { data, loading, error, reload };
};
