import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import SalesPage from "./pages/SalesPage";
import NewOrderPage from "./pages/NewOrderPage";
import OrdersPage from "./pages/OrdersPage";
import MenuPage from "./pages/MenuPage";
import CashRegisterPage from "./pages/CashRegisterPage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./components/layout/MainLayout";
import { type PageId } from "./components/layout/Sidebar";
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
      case "cash-register":
        return <CashRegisterPage />;
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
    <MainLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={() => setIsAuthenticated(false)}
    >
      {renderCurrentPage()}
    </MainLayout>
  );
}

export default App;