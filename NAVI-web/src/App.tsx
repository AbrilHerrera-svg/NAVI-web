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
import { InventoryProvider } from "./features/inventory";
import { MenuProvider } from "./features/menu";
import { OrdersProvider } from "./features/orders";
import { CashRegisterProvider } from "./features/cash-register";
import { ExtrasProvider } from "./features/extras";
import { SessionProvider, type ProfileInfo } from "./features/profile";
import { login, logout } from "./features/auth";
import { errorMessage } from "./lib/api";
import { useScrollToSection } from "./lib/useScrollToSection";
import { UsersProvider } from "./features/users";
import { TasksProvider } from "./features/tasks";

// Puedes importar aquí tus otras páginas a medida que las crees

function App() {
  // Perfil de quien inició sesión; null = no hay sesión
  const [sessionProfile, setSessionProfile] = useState<ProfileInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  // Sección a la que debe hacer scroll el buscador del Topbar (null = ninguna)
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  const clearPendingSection = useCallback(() => setPendingSection(null), []);
  useScrollToSection(pendingSection, clearPendingSection);

  // El buscador lleva a la página elegida y, si la entrada tiene sección, hace scroll hasta ella
  const handleSearchSelect = (entry: SearchEntry) => {
    setCurrentPage(entry.page);
    setPendingSection(entry.sectionId ?? null);
  };

  const handleLogin = async (email: string, password: string): Promise<string | null> => {
    try {
      setSessionProfile(await login(email, password));
      return null;
    } catch (error) {
      return errorMessage(error);
    }
  };

  const handleLogout = () => {
    logout();
    setSessionProfile(null);
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

  if (!sessionProfile) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <SessionProvider initialProfile={sessionProfile}>
      <UsersProvider>
        <TasksProvider>
          <InventoryProvider>
            <MenuProvider>
              <ExtrasProvider>
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
              </ExtrasProvider>
            </MenuProvider>
          </InventoryProvider>
        </TasksProvider>
      </UsersProvider>
    </SessionProvider>
  );
}

export default App;