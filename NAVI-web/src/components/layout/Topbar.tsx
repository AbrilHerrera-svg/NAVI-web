import { useState } from "react";
import * as Icons from "lucide-react";
import { type PageId } from "./Sidebar";
import SearchBox from "./SearchBox";
import { type SearchEntry } from "./searchIndex";
import { confirmDialog } from "../ui/notify";

const pageTitles: Record<PageId, string> = {
  dashboard: "Inicio",
  sales: "Ventas",
  orders: "Pedidos",
  "new-order": "Nuevo pedido",
  menu: "Menú",
  inventory: "Inventario",
  tasks: "Tareas",
  users: "Usuarios",
  "cash-register": "Caja",
  profile: "Mi perfil",
  settings: "Configuración",
};

interface TopbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  onSearchSelect: (entry: SearchEntry) => void;
}

export default function Topbar({ currentPage, onNavigate, onLogout, onSearchSelect }: TopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-16 w-full border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <span className="font-semibold text-slate-800">
        {pageTitles[currentPage]}
      </span>

      <SearchBox onSelect={onSearchSelect} />

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors"
        >
          <Icons.User size={18} />
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 z-20 text-left text-xs font-medium">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate("profile");
                }}
                className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-left cursor-pointer"
              >
                Mi perfil
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate("settings");
                }}
                className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-left cursor-pointer"
              >
                Configuración
              </button>
              <button
                onClick={async () => {
                  setIsMenuOpen(false);
                  const accepted = await confirmDialog({
                    title: "¿Cerrar sesión?",
                    message: "Tendrás que volver a iniciar sesión para entrar.",
                    confirmLabel: "Cerrar sesión",
                    variant: "danger",
                  });
                  if (accepted) {
                    onLogout();
                  }
                }}
                className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 text-left cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}