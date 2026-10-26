import { useState } from "react";
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
import { InventoryProvider } from "./features/inventory";
import { OrdersProvider } from "./features/orders";
import { SessionProvider } from "./features/profile";
import { UsersProvider } from "./features/users";
import { TasksProvider } from "./features/tasks";

// Puedes importar aquí tus otras páginas a medida que las crees

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");

  // Renderizado dinámico según la opción seleccionada
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
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

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <SessionProvider>
      <UsersProvider>
        <TasksProvider>
          <InventoryProvider>
            <OrdersProvider>
              <MainLayout
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onLogout={() => setIsAuthenticated(false)}
              >
                {renderCurrentPage()}
              </MainLayout>
            </OrdersProvider>
          </InventoryProvider>
        </TasksProvider>
      </UsersProvider>
    </SessionProvider>
  );
}

export default App;