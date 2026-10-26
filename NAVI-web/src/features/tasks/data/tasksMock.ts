import { todayISO } from '../../../lib/date';
import type { Task } from '../types';

// Las tareas de ejemplo son de "hoy" para que la checklist siempre aplique al día actual.
// assigneeId apunta a features/users/data/usersMock.ts.
const today = todayISO();

export const mockTasks: Task[] = [
  { id: 't-1', date: today, name: 'Desinfectar mostradores y equipo', description: 'Barra, mostrador y tablas de corte.', category: 'Apertura', requiredForClose: false, assigneeId: 'u-sofia', dueTime: '08:00', repeat: 'Todos los días', reminderMinutes: 10, done: true },
  { id: 't-2', date: today, name: 'Encender la cafetera espresso y revisar el agua', description: 'Purgar grupos y revisar nivel del depósito.', category: 'Apertura', requiredForClose: false, assigneeId: 'u-sofia', dueTime: '08:15', repeat: 'Todos los días', reminderMinutes: 10, done: true },
  { id: 't-3', date: today, name: 'Reabastecer té, leche y toppings', description: 'Revisar existencias en barra contra el mínimo.', category: 'Apertura', requiredForClose: false, assigneeId: 'u-diego', dueTime: '08:30', repeat: 'Todos los días', reminderMinutes: 0, done: true },
  { id: 't-4', date: today, name: 'Contar el fondo inicial de efectivo', description: 'Registrar el fondo en Caja antes de abrir.', category: 'Apertura', requiredForClose: false, assigneeId: 'u-diego', dueTime: '08:45', repeat: 'Todos los días', reminderMinutes: 15, done: true },
  { id: 't-5', date: today, name: 'Revisar disponibilidad del menú de hoy', description: 'Desactivar productos sin ingredientes.', category: 'Apertura', requiredForClose: false, assigneeId: 'u-ana', dueTime: '09:00', repeat: 'Todos los días', reminderMinutes: 0, done: true },

  { id: 't-6', date: today, name: 'Limpiar y desinfectar las estaciones de trabajo', description: 'Barra y cocina, incluidas las licuadoras.', category: 'Cierre', requiredForClose: true, assigneeId: 'u-valeria', dueTime: '21:00', repeat: 'Todos los días', reminderMinutes: 15, done: true },
  { id: 't-7', date: today, name: 'Lavar utensilios y vaciar botes', description: 'Sacar la basura al contenedor exterior.', category: 'Cierre', requiredForClose: true, assigneeId: 'u-mateo', dueTime: '21:15', repeat: 'Todos los días', reminderMinutes: 10, done: true },
  { id: 't-8', date: today, name: 'Guardar y etiquetar los ingredientes restantes', description: 'Etiqueta con fecha de apertura.', category: 'Cierre', requiredForClose: true, assigneeId: 'u-mateo', dueTime: '21:30', repeat: 'Todos los días', reminderMinutes: 10, done: false },
  { id: 't-9', date: today, name: 'Cuadrar y cerrar la caja', description: 'Contar efectivo y registrar diferencias en Caja.', category: 'Cierre', requiredForClose: true, assigneeId: 'u-abril', dueTime: '21:45', repeat: 'Todos los días', reminderMinutes: 15, done: false },
  { id: 't-10', date: today, name: 'Apagar equipos y revisar puertas', description: 'Cafetera, licuadoras, luces y aire.', category: 'Cierre', requiredForClose: true, assigneeId: 'u-abril', dueTime: '22:00', repeat: 'Todos los días', reminderMinutes: 0, done: false },

  { id: 't-11', date: today, name: 'Limpieza profunda de cocina', description: 'Estufa, campana y piso.', category: 'Limpieza', area: 'Cocina', requiredForClose: false, assigneeId: 'u-mateo', dueTime: '16:00', repeat: 'Todos los días', reminderMinutes: 0, done: true },
  { id: 't-12', date: today, name: 'Limpieza de barra', description: 'Máquinas, jarras y tarjas.', category: 'Limpieza', area: 'Barra', requiredForClose: false, assigneeId: 'u-valeria', dueTime: '17:00', repeat: 'Todos los días', reminderMinutes: 0, done: false },
  { id: 't-13', date: today, name: 'Limpieza de mesas y sillas', description: 'Incluye terraza.', category: 'Limpieza', area: 'Mesas', requiredForClose: false, assigneeId: 'u-sofia', dueTime: '14:00', repeat: 'Todos los días', reminderMinutes: 0, done: true },
  { id: 't-14', date: today, name: 'Limpieza de baños', description: 'Reponer papel y jabón.', category: 'Limpieza', area: 'Baños', requiredForClose: false, assigneeId: 'u-diego', dueTime: '13:00', repeat: 'Todos los días', reminderMinutes: 0, done: true },

  { id: 't-15', date: today, name: 'Inventario de leche', description: 'Contar cajas y registrar ajuste si no cuadra.', category: 'General', requiredForClose: false, assigneeId: 'u-mateo', dueTime: '18:00', repeat: 'Entre semana', reminderMinutes: 30, done: false },
];