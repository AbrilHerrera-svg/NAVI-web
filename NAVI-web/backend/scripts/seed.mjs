// Siembra Firestore con UN documento de ejemplo por colección, con valores
// genéricos ("Nombre del producto", 0, etc.) para que se entienda la forma de
// cada colección sin que parezca data real de negocio. Bórralos cuando ya
// tengas datos reales capturados desde la app.
// Uso: node scripts/seed.mjs   (desde backend/, con serviceAccountKey.json presente)
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const cuenta = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));
initializeApp({ credential: cert(cuenta) });
const db = getFirestore();

// Los campos "date" se guardan como Timestamp de Firestore (no string ISO).
// El front sigue recibiendo string ISO: el backend convierte con tsToISO()
// al leer, igual que fromISO() convierte al escribir.
const fromISO = (iso) => Timestamp.fromDate(new Date(`${iso}T00:00:00`));
const todayISO = new Date().toISOString().slice(0, 10);
const today = fromISO(todayISO);

const users = [
  { id: "usuario-1", name: "Nombre del usuario", email: "usuario@correo.com", phone: "0000000000", role: "Cajero", status: "Activo", shift: "Matutino" },
];

const menuItems = [
  { id: "producto-1", name: "Nombre del producto", category: "Categoría de ejemplo", priceSingle: 0, prepTime: "0 min", available: true, status: "Activo" },
];

const ingredients = [
  { id: "ingrediente-1", name: "Nombre del ingrediente", stock: 0, minStock: 0, costPerBox: 0, unit: "unidad", unitsPerBox: 1 },
];

const recipes = [
  { id: "producto-1", lines: [{ ingredientId: "ingrediente-1", amountSingle: 1 }] },
];

const inventoryMovements = [
  { id: "movimiento-1", ingredientId: "ingrediente-1", ingredientName: "Nombre del ingrediente", type: "Ajuste", quantity: 0, date: today, dateLabel: "Fecha de ejemplo", reference: "Referencia de ejemplo" },
];

const orders = [
  {
    id: "pedido-1",
    orderNumber: "#1",
    origin: "Mostrador",
    receivedTime: "0:00",
    dueTime: "Vence 0:00",
    customerName: "Nombre del cliente",
    productsSummary: "Nombre del producto",
    total: 0,
    status: "Nuevo",
    cart: [
      {
        product: { id: "producto-1", name: "Nombre del producto", category: "Cocina", categoryLabel: "Categoría de ejemplo", price: 0 },
        quantity: 1,
        extras: [],
      },
    ],
  },
];

const tasks = [
  { id: "tarea-1", date: today, name: "Nombre de la tarea", description: "Descripción de la tarea", category: "General", requiredForClose: false, assigneeId: "usuario-1", dueTime: "00:00", repeat: "Una vez", reminderMinutes: 0, done: false },
];

const cashSessions = [
  {
    id: "caja-" + todayISO,
    date: today,
    status: "Abierto",
    openedBy: "Nombre del usuario",
    initialFund: 0,
    salesByMethod: [
      { label: "Efectivo", amount: 0 },
      { label: "Terminal de tarjeta", amount: 0 },
      { label: "Transferencia", amount: 0 },
    ],
    dailyExpenses: [],
    refunds: [],
  },
];

const businessInfo = {
  name: "Nombre del negocio",
  address: "Dirección de ejemplo",
  phone: "0000000000",
  hours: "00:00 a. m. – 00:00 p. m.",
};

const notificationSettings = {
  items: [
    { id: "ejemplo", label: "Nombre de la notificación", description: "Descripción de la notificación", enabled: true },
  ],
};

async function seedCollection(name, docs) {
  const batch = db.batch();
  for (const doc of docs) {
    const { id, ...data } = doc;
    batch.set(db.collection(name).doc(id), data);
  }
  await batch.commit();
  console.log(`✓ ${name}: ${docs.length} docs`);
}

await seedCollection("users", users);
await seedCollection("menuItems", menuItems);
await seedCollection("ingredients", ingredients);
await seedCollection("recipes", recipes);
await seedCollection("inventoryMovements", inventoryMovements);
await seedCollection("orders", orders);
await seedCollection("tasks", tasks);
await seedCollection("cashSessions", cashSessions);

await db.collection("settings").doc("business").set(businessInfo);
await db.collection("settings").doc("notifications").set(notificationSettings);
console.log("✓ settings: business, notifications");

console.log("\nListo.");
