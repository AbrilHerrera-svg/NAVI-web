import type { BusinessInfo, NotificationSetting } from '../types';

export const mockBusinessInfo: BusinessInfo = {
  name: 'NAVI Café',
  address: 'Av. Reforma 123, CDMX',
  phone: '55 8765 4321',
  hours: '8:00 a. m. – 9:00 p. m.',
};

export const mockNotificationSettings: NotificationSetting[] = [
  {
    id: 'low-stock',
    label: 'Inventario bajo mínimo',
    description: 'Avisar cuando un ingrediente esté por agotarse',
    enabled: true,
  },
  {
    id: 'late-orders',
    label: 'Pedidos atrasados',
    description: 'Avisar cuando un pedido pase su tiempo estimado',
    enabled: true,
  },
  {
    id: 'cash-diff',
    label: 'Diferencias de caja',
    description: 'Avisar cuando el cierre de caja no cuadre',
    enabled: true,
  },
  {
    id: 'daily-summary',
    label: 'Resumen diario',
    description: 'Recibir un resumen de ventas al cerrar el día',
    enabled: false,
  },
];
