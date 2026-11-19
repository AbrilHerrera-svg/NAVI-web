import { Timestamp } from "firebase-admin/firestore";
import { db } from "../config/firebase";

// ---------- tipos de lo que hay en Firestore (ver "Esquema de Base de Datos") ----------

export interface ItemOrden {
  cantidad: number;
  itemID: string;
  nombre: string;
  notas: string;
  precioUnitario: number;
}

export interface Orden {
  id: string;
  clienteNombre: string;
  creadoEn: Date | null;
  estado: string;
  horaRecoleccion: Date | null;
  items: ItemOrden[];
  mesaNumero: number | null;
  metodoPago: string;
  pagado: boolean;
  subtotal: number;
  tipo: string;
  total: number;
}

export interface PlatilloMenu {
  id: string;
  nombre: string;
  categoria: string;
  disponible: boolean;
  precio: number;
  tiempoPrepMinutos: number | null;
}

export interface Insumo {
  id: string;
  insumo: string;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  costoUnitario: number;
}

export interface CorteCaja {
  id: string;
  fechaApertura: Date | null;
  fechaCierre: Date | null;
  diferencia: number;
  fondoInicial: number;
}

// ---------- helpers de lectura segura ----------

const aFecha = (valor: unknown): Date | null => {
  if (valor instanceof Timestamp) return valor.toDate();
  if (valor instanceof Date) return valor;
  return null;
};

const aNumero = (valor: unknown): number =>
  typeof valor === "number" && Number.isFinite(valor) ? valor : 0;

const aTexto = (valor: unknown): string => (typeof valor === "string" ? valor : "");

// ---------- consultas ----------

// Pedidos creados entre "desde" (incluido) y "hasta" (excluido)
export const ordenesEntre = async (desde: Date, hasta: Date): Promise<Orden[]> => {
  const snap = await db
    .collection("orders")
    .where("creadoEn", ">=", Timestamp.fromDate(desde))
    .where("creadoEn", "<", Timestamp.fromDate(hasta))
    .get();

  return snap.docs.map((doc) => {
    const d = doc.data();
    const items: ItemOrden[] = Array.isArray(d.items)
      ? d.items.map((it: Record<string, unknown>) => ({
          cantidad: aNumero(it.cantidad),
          itemID: aTexto(it.itemID),
          nombre: aTexto(it.nombre),
          notas: aTexto(it.notas),
          precioUnitario: aNumero(it.precioUnitario),
        }))
      : [];

    return {
      id: doc.id,
      clienteNombre: aTexto(d.clienteNombre),
      creadoEn: aFecha(d.creadoEn),
      estado: aTexto(d.estado),
      horaRecoleccion: aFecha(d.horaRecoleccion),
      items,
      mesaNumero: typeof d.mesaNumero === "number" ? d.mesaNumero : null,
      metodoPago: aTexto(d.metodoPago),
      pagado: d.pagado === true,
      subtotal: aNumero(d.subtotal),
      tipo: aTexto(d.tipo),
      total: aNumero(d.total),
    };
  });
};

export const menuCompleto = async (): Promise<PlatilloMenu[]> => {
  const snap = await db.collection("menu").get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      nombre: aTexto(d.nombre),
      categoria: aTexto(d.categoria),
      // si el campo no existe se asume disponible
      disponible: d.disponible !== false,
      precio: aNumero(d.precio),
      tiempoPrepMinutos:
        typeof d.tiempoPrepMinutos === "number" ? d.tiempoPrepMinutos : null,
    };
  });
};

export const inventarioCompleto = async (): Promise<Insumo[]> => {
  const snap = await db.collection("inventory").get();
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      insumo: aTexto(d.insumo),
      stockActual: aNumero(d.stockActual),
      stockMinimo: aNumero(d.stockMinimo),
      unidad: aTexto(d.unidad),
      costoUnitario: aNumero(d.costoUnitario),
    };
  });
};

// El corte de caja más reciente (por fecha de apertura)
export const ultimoCorteDeCaja = async (): Promise<CorteCaja | null> => {
  const snap = await db
    .collection("cash_cuts")
    .orderBy("fechaApertura", "desc")
    .limit(1)
    .get();

  const doc = snap.docs[0];
  if (!doc) return null;
  const d = doc.data();
  return {
    id: doc.id,
    fechaApertura: aFecha(d.fechaApertura),
    fechaCierre: aFecha(d.fechaCierre),
    diferencia: aNumero(d.diferencia),
    fondoInicial: aNumero(d.fondoInicial),
  };
};
