import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar simulado de NAVI */}
      <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-navi flex items-center justify-center text-white font-bold text-sm">
              🚀
            </div>
            <span className="font-extrabold text-lg tracking-wider text-slate-800">NAVI</span>
          </div>

          {/* Menú de navegación */}
          <nav className="space-y-1 text-sm font-medium">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-navi text-white font-semibold">
              <span>🏠</span> Inicio
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>📈</span> Ventas
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>📋</span> Pedidos
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>➕</span> Nuevo pedido
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>📖</span> Menú
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>💳</span> Caja
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>📉</span> Finanzas
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>📦</span> Inventario
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>📅</span> Reservaciones
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>☑️</span> Tareas
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <span>👥</span> Usuarios
            </button>
          </nav>
        </div>
      </aside>

      {/* Contenido principal (Dashboard) */}
      <main className="flex-1 overflow-y-auto">
        <DashboardPage />
      </main>
    </div>
  );
}

export default App;
