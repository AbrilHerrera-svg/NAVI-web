import type { TeamUser } from '../types';

//Usuarios de prueba
export const mockUsers: TeamUser[] = [
  { id: 'u-ana', name: 'Ana García', email: 'ana.garcia@navi.cafe', role: 'Dueño', status: 'Activo', shift: 'Matutino' },
  { id: 'u-abril', name: 'Abril Herrera', email: 'abril@navi.cafe', role: 'Encargado', status: 'Activo', shift: 'Vespertino' },
  { id: 'u-diego', name: 'Diego Ruiz', email: 'diego@navi.cafe', role: 'Cajero', status: 'Activo', shift: 'Matutino' },
  { id: 'u-sofia', name: 'Sofía Torres', email: 'sofia@navi.cafe', role: 'Barista', status: 'Activo', shift: 'Matutino' },
  { id: 'u-mateo', name: 'Mateo Ríos', email: 'mateo@navi.cafe', role: 'Cocina', status: 'Activo', shift: 'Vespertino' },
  { id: 'u-valeria', name: 'Valeria Cruz', email: 'valeria@navi.cafe', role: 'Barista', status: 'Activo', shift: 'Vespertino' },
  { id: 'u-lucas', name: 'Lucas Pérez', email: 'lucas@navi.cafe', role: 'Cajero', status: 'Inactivo', shift: 'Vespertino' },
];