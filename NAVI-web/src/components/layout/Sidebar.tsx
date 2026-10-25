import * as Icons from "lucide-react";
import naviLogo from "../../assets/navi-cohete.svg";
export type PageId =
  | "dashboard"
  | "sales"
  | "orders"
  | "new-order"
  | "menu"
  | "cash-register"
  | "finances"
  | "inventory"
  | "reservations"
  | "tasks"
  | "users";

const menuItems: { id: PageId; label: string; icon: Icons.LucideIcon }[] = [
  { id: "dashboard", label: "Inicio", icon: Icons.House },
  { id: "sales", label: "Ventas", icon: Icons.ChartColumnIncreasing },
  { id: "orders", label: "Pedidos", icon: Icons.ClipboardList },
  { id: "new-order", label: "Nuevo pedido", icon: Icons.ClipboardPlus },
  { id: "menu", label: "Menú", icon: Icons.UtensilsCrossed },
  { id: "cash-register", label: "Caja", icon: Icons.CreditCardReader },
  { id: "inventory", label: "Inventario", icon: Icons.ShelvingUnit },
  { id: "tasks", label: "Tareas", icon: Icons.SquareCheckBig },
  { id: "users", label: "Usuarios", icon: Icons.Users },
];
interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 py-4 mb-4">
          <img src={naviLogo} alt="Navi" className="w-8 h-8" />
          <span className="font-extrabold text-lg tracking-wider text-[#5960A1]">
            NAVI
          </span>
        </div>

        {/* Menú de navegación dinámico */}
        <nav className="space-y-1 text-sm font-medium">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#5960A1] text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
