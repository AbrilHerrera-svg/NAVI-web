import { Timestamp } from "firebase-admin/firestore";

// El front siempre trabaja con fechas como string ISO "yyyy-mm-dd" (ver
// features/*/types.ts); Firestore las guarda como Timestamp. Estas dos
// funciones son el único lugar donde se cruza esa frontera.
export const fromISO = (iso: string) => Timestamp.fromDate(new Date(`${iso}T00:00:00`));

export const toISO = (ts: Timestamp) => ts.toDate().toISOString().slice(0, 10);
