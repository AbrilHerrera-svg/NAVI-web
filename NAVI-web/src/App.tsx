import { useCallback, useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import SalesPage from "./pages/SalesPage";
import NewOrderPage from "./pages/NewOrderPage";
import OrdersPage from "./pages/OrdersPage";
import MenuPage from "./pages/MenuPage";
import CashRegisterPage from "./pages/CashRegisterPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import MainLayout from "./components/layout/MainLayout";
import TasksPage from "./pages/TasksPage";
import { type PageId } from "./components/layout/Sidebar";
import { type SearchEntry } from "./components/layout/searchIndex";
import { useScrollToSection } from "./lib/useScrollToSection";
import { InventoryProvider } from "./features/inventory";
import { MenuProvider } from "./features/menu";
import { OrdersProvider } from "./features/orders";
import { CashRegisterProvider } from "./features/cash-register";
import { iniciarSesion, cerrarSesion, obtenerSesion } from "./features/auth";
import { SessionProvider, type ProfileInfo } from "./features/profile";
import { UsersProvider } from "./features/users";
import { TasksProvider } from "./features/tasks";

// Puedes importar aquí tus otras páginas a medida que las crees

function App() {
  // si ya había una sesión guardada, entra directo sin pedir login
  const [profile, setProfile] = useState<ProfileInfo | null>(
    () => obtenerSesion()?.perfil ?? null
  );
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");

  // sección a la que hay que hacer scroll después de que el buscador cambie de página
  const [sectionToScroll, setSectionToScroll] = useState<string | null>(null);
  const clearSectionToScroll = useCallback(() => setSectionToScroll(null), []);
  useScrollToSection(sectionToScroll, clearSectionToScroll);

  const handleSearchSelect = (entry: SearchEntry) => {
    setCurrentPage(entry.page);
    if (entry.sectionId) {
      setSectionToScroll(entry.sectionId);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const perfil = await iniciarSesion(email, password);
    setProfile(perfil);
  };

  const handleLogout = () => {
    cerrarSesion();
    setProfile(null);
    setCurrentPage("dashboard");
  };

  // Renderizado dinámico según la opción seleccionada
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentPage} />;
      case "sales":
        return <SalesPage />;
      case "new-order":
        return <NewOrderPage />;
      case "orders":
        return (
          <OrdersPage
            onNavigateToNewOrder={() => setCurrentPage("new-order")}
          />
        );
      case "menu":
        return <MenuPage />;
      case "users":
        return <UsersPage />;
      case "cash-register":
        return <CashRegisterPage />;
      case "inventory":
        return <InventoryPage />;
      case "tasks":
        return (
          <TasksPage
            onNavigateToCashRegister={() => setCurrentPage("cash-register")}
          />
        );
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <div className="p-8 text-center text-slate-400">
            <h2 className="text-xl font-bold text-slate-700 mb-2 capitalize">
              {currentPage}
            </h2>
            <p>Esta pantalla aún está en construcción.</p>
          </div>
        );
    }
  };

  if (!profile) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <SessionProvider initialProfile={profile}>
      <UsersProvider>
        <TasksProvider>
          <InventoryProvider>
            <MenuProvider>
              <OrdersProvider>
                <CashRegisterProvider>
                  <MainLayout
                    currentPage={currentPage}
                    onNavigate={setCurrentPage}
                    onLogout={handleLogout}
                    onSearchSelect={handleSearchSelect}
                  >
                    {renderCurrentPage()}
                  </MainLayout>
                </CashRegisterProvider>
              </OrdersProvider>
            </MenuProvider>
          </InventoryProvider>
        </TasksProvider>
      </UsersProvider>
    </SessionProvider>
  );
}

export default App;