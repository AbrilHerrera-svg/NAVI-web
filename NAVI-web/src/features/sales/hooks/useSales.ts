import { useEffect, useState } from "react";
import { obtenerVentas } from "../services/salesService";
import type { SalesData, SalesPeriod } from "../types";

// Carga las ventas del periodo elegido (se vuelve a pedir cuando cambia el periodo).
export const useSales = (period: SalesPeriod) => {
  const [data, setData] = useState<SalesData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false; // evita actualizar el estado si el componente ya se cerró

    obtenerVentas(period)
      .then((datos) => {
        if (cancelled) return;
        setData(datos);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar las ventas");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period, reloadKey]);

  // cambiar de periodo también vuelve a pedir datos, así que marcamos "cargando" al elegirlo
  const reload = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  return { data, loading, error, reload };
};
