import { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import SalesPage from './pages/SalesPage';
import NewOrderPage from './pages/NewOrderPage';
// Puedes importar aquí tus otras páginas a medida que las crees

type PageId = 
  | 'dashboard' 
  | 'sales' 
  | 'orders' 
  | 'new-order' 
  | 'menu' 
  | 'cash-register' 
  | 'finances' 
  | 'inventory' 
  | 'reservations' 
  | 'tasks' 
  | 'users';

const menuItems: { id: PageId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Inicio', icon: '🏠' },
  { id: 'sales', label: 'Ventas', icon: '📈' },
  { id: 'orders', label: 'Pedidos', icon: '📋' },
  { id: 'new-order', label: 'Nuevo pedido', icon: '➕' },
  { id: 'menu', label: 'Menú', icon: '📖' },
  { id: 'cash-register', label: 'Caja', icon: '💳' },
  { id: 'finances', label: 'Finanzas', icon: '📉' },
  { id: 'inventory', label: 'Inventario', icon: '📦' },
  { id: 'reservations', label: 'Reservaciones', icon: '📅' },
  { id: 'tasks', label: 'Tareas', icon: '☑️' },
  { id: 'users', label: 'Usuarios', icon: '👥' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');

  // Renderizado dinámico según la opción seleccionada
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'sales':
        return <SalesPage />;
      case 'new-order':
        return <NewOrderPage />;
      default:
        return (
          <div className="p-8 text-center text-slate-400">
            <h2 className="text-xl font-bold text-slate-700 mb-2 capitalize">{currentPage}</h2>
            <p>Esta pantalla aún está en construcción.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar de NAVI */}
      <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#5960A1] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              🚀
            </div>
            <span className="font-extrabold text-lg tracking-wider text-slate-800">NAVI</span>
          </div>

          {/* Menú de navegación dinámico */}
          <nav className="space-y-1 text-sm font-medium">
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#5960A1] text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Contenido dinámico */}
      <main className="flex-1 overflow-y-auto">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;