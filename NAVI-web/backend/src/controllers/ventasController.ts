import type { Request, Response } from "express";
import { menuCompleto, ordenesEntre, type Orden } from "../models/dashboardModel";
import type { BarraVentaDTO, PeriodoVentas, VentasDTO } from "../types/ventas";
import {
  diaDelMesLocal,
  diaSemanaLocal,
  horaLocal,
  inicioDelDia,
  inicioDelMes,
  sumarDias,
} from "../utils/fechas";

const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DIAS_LARGOS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const dinero = (n: number, decimales = 0) =>
  `$${n.toLocaleString("es-MX", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })}`;

// una venta cuenta cuando está pagada y no fue cancelada
const esVenta = (o: Orden) => {
  const estado = o.estado.trim().toLowerCase();
  return o.pagado && estado !== "cancelado" && estado !== "cancelada";
};

const noCancelado = (o: Orden) => {
  const estado = o.estado.trim().toLowerCase();
  return estado !== "cancelado" && estado !== "cancelada";
};

// Rango de fechas según el periodo que pidió el front
const rangoDe = (periodo: PeriodoVentas, ahora: Date) => {
  const inicioHoy = inicioDelDia(ahora);
  const manana = sumarDias(inicioHoy, 1);

  if (periodo === "ayer") return { desde: sumarDias(inicioHoy, -1), hasta: inicioHoy };
  if (periodo === "semana") {
    const diasDesdeLunes = (diaSemanaLocal(ahora) + 6) % 7;
    return { desde: sumarDias(inicioHoy, -diasDesdeLunes), hasta: manana };
  }
  if (periodo === "mes") return { desde: inicioDelMes(ahora), hasta: manana };
  return { desde: inicioHoy, hasta: manana };
};

// Agrupa las ventas: por hora (hoy/ayer) o por día (semana/mes)
const armarGrafica = (
  ventas: Orden[],
  periodo: PeriodoVentas,
  desde: Date,
  hasta: Date
): BarraVentaDTO[] => {
  const porHora = periodo === "hoy" || periodo === "ayer";
  const montos = new Map<number, number>();

  for (const o of ventas) {
    if (!o.creadoEn) continue;
    // la clave es la hora (0-23) o el día desde el inicio del rango
    const clave = porHora
      ? horaLocal(o.creadoEn)
      : Math.floor((o.creadoEn.getTime() - desde.getTime()) / (24 * 60 * 60 * 1000));
    montos.set(clave, (montos.get(clave) ?? 0) + o.total);
  }

  // lista de barras (con las horas/días vacíos incluidos)
  const barras: { label: string; amount: number }[] = [];
  if (porHora) {
    const horas = [...montos.keys()];
    const primera = Math.min(8, ...horas);
    const ultima = Math.max(20, ...horas);
    for (let h = primera; h <= ultima; h++) {
      barras.push({ label: `${h}h`, amount: montos.get(h) ?? 0 });
    }
  } else {
    const totalDias = Math.round((hasta.getTime() - desde.getTime()) / (24 * 60 * 60 * 1000));
    for (let i = 0; i < totalDias; i++) {
      const dia = sumarDias(desde, i);
      const etiqueta =
        periodo === "semana" ? DIAS_CORTOS[diaSemanaLocal(dia)] : String(diaDelMesLocal(dia));
      barras.push({ label: etiqueta, amount: montos.get(i) ?? 0 });
    }
  }

  const maximo = Math.max(0, ...barras.map((b) => b.amount));
  return barras.map((b) => ({
    label: b.label,
    amount: b.amount,
    percent: maximo > 0 ? Math.max(3, Math.round((b.amount / maximo) * 100)) : 3,
    peak: maximo > 0 && b.amount === maximo,
  }));
};

const clasificarPago = (texto: string) => {
  const t = texto.toLowerCase();
  if (t.includes("efectivo")) return "Efectivo";
  if (t.includes("tarjeta")) return "Terminal de tarjeta";
  if (t.includes("transfer")) return "Transferencia";
  return "Otro";
};

// ---------- GET /api/ventas?periodo=hoy ----------
export const obtenerVentas = async (req: Request, res: Response) => {
  try {
    const pedido = String(req.query.periodo ?? "hoy");
    const periodo: PeriodoVentas = ["hoy", "ayer", "semana", "mes"].includes(pedido)
      ? (pedido as PeriodoVentas)
      : "hoy";

    const ahora = new Date();
    const { desde, hasta } = rangoDe(periodo, ahora);

    const [ordenes, menu] = await Promise.all([ordenesEntre(desde, hasta), menuCompleto()]);
    const ventas = ordenes.filter(esVenta);

    // Métricas
    const total = ventas.reduce((acc, o) => acc + o.total, 0);
    const ticket = ventas.length ? total / ventas.length : 0;
    const grafica = armarGrafica(ventas, periodo, desde, hasta);
    const mejor = grafica.find((b) => b.peak);

    // "Mejor día u hora": hora si es hoy/ayer, día si es semana/mes
    let mejorTexto = "—";
    if (mejor) {
      if (periodo === "semana") {
        const indice = grafica.indexOf(mejor);
        mejorTexto = DIAS_LARGOS[diaSemanaLocal(sumarDias(desde, indice))];
        mejorTexto = mejorTexto.charAt(0).toUpperCase() + mejorTexto.slice(1);
      } else if (periodo === "mes") {
        mejorTexto = `Día ${mejor.label}`;
      } else {
        mejorTexto = mejor.label.replace("h", ":00");
      }
    }

    // Métodos de pago
    const porMetodo = new Map<string, number>();
    for (const o of ventas) {
      const m = clasificarPago(o.metodoPago);
      porMetodo.set(m, (porMetodo.get(m) ?? 0) + o.total);
    }
    const metodos = ["Efectivo", "Terminal de tarjeta", "Transferencia", "Otro"]
      .filter((m) => m !== "Otro" || (porMetodo.get(m) ?? 0) > 0)
      .map((m) => ({ label: m, amount: dinero(porMetodo.get(m) ?? 0) }));

    // Más vendidos (sin pedidos cancelados)
    const conteo = new Map<string, { name: string; count: number }>();
    for (const o of ordenes.filter(noCancelado)) {
      for (const item of o.items) {
        const clave = item.itemID || item.nombre;
        const previo = conteo.get(clave);
        conteo.set(clave, {
          name: previo?.name ?? item.nombre,
          count: (previo?.count ?? 0) + item.cantidad,
        });
      }
    }
    const topProducts = [...conteo.values()].sort((a, b) => b.count - a.count).slice(0, 5);

    const respuesta: VentasDTO = {
      generatedAt: ahora.toISOString(),
      metrics: [
        { label: "Ventas totales", value: dinero(total) },
        { label: "Pedidos", value: String(ventas.length) },
        { label: "Ticket promedio", value: ticket ? dinero(ticket, 2) : "—" },
        {
          label: periodo === "hoy" || periodo === "ayer" ? "Mejor hora" : "Mejor día",
          value: mejorTexto,
        },
      ],
      chartTitle: periodo === "hoy" || periodo === "ayer" ? "Ventas por hora" : "Ventas por día",
      chart: grafica,
      paymentMethods: metodos,
      totalLabel: `Todos los pagos · ${dinero(total)} en total`,
      topProducts,
      outOfStock: menu.filter((m) => !m.disponible).map((m) => m.nombre),
    };

    res.json(respuesta);
  } catch (error) {
    console.log("Error en ventas:", error);
    res.status(500).json({ mensaje: "No se pudieron cargar las ventas" });
  }
};
