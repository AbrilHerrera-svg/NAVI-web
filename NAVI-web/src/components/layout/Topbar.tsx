import * as Icons from "lucide-react";
import { type PageId } from "./Sidebar"

const pageTitles: Record<PageId, string> = 
    {
      dashboard: "Inicio",
      sales: "Ventas",
      orders: "Pedidos",
      "new-order": "Nuevo pedido",
      menu: "Menú",
      inventory: "Inventario",
      tasks: "Tareas",
      users: "Usuarios",
      "cash-register": "Caja",    
    }


interface TopbarProps {
  currentPage: PageId;
}

export default function Topbar({ currentPage }: TopbarProps) {
  return (
    <header className="h-16 w-full border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <span className="font-semibold text-slate-800">
        {pageTitles[currentPage]}
      </span>

      <div className="flex-1 max-w-md mx-6 relative">
        <Icons.Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Buscar"
          className="w-full rounded-lg bg-slate-100 pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#5960A1]/30"
        />
      </div>

      <button className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
        <Icons.User size={18} />
      </button>
    </header>
  );
}
