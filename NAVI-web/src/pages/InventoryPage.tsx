import { useState } from 'react';
import {
  InventoryHeader,
  InventoryMetrics,
  InventoryTabs,
  IngredientsTableView,
  MovementsView,
  TodayMovementsCard,
  AdjustStockForm,
  RegisterPurchaseForm,
  mockTodayMovements,
  useInventory,
  type InventoryTab,
  type InventoryView,
} from '../features/inventory';

export default function InventoryPage() {
  const { ingredients, movements, adjustStock, registerPurchase } = useInventory();
  const [view, setView] = useState<InventoryView>('inventario');
  const [currentTab, setCurrentTab] = useState<InventoryTab>('ingredientes');

  // Regresa a la vista principal mostrando el historial para ver el movimiento recién creado
  const backToMovements = () => {
    setCurrentTab('movimientos');
    setView('inventario');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Formulario de Ajuste de existencias */}
      {view === 'ajuste' ? (
        <AdjustStockForm
          ingredients={ingredients}
          onCancel={() => setView('inventario')}
          onSubmit={(input) => {
            adjustStock(input);
            backToMovements();
          }}
        />
      ) : view === 'compra' ? (
        /* 2. Formulario de Registro de compra */
        <RegisterPurchaseForm
          ingredients={ingredients}
          onCancel={() => setView('inventario')}
          onSubmit={(input) => {
            registerPurchase(input);
            backToMovements();
          }}
        />
      ) : (
        /* 3. Vista principal (Ingredientes o Movimientos) */
        <>
          <InventoryHeader
            onAdjustStock={() => setView('ajuste')}
            onRegisterPurchase={() => setView('compra')}
          />

          <InventoryMetrics ingredients={ingredients} />

          <InventoryTabs currentTab={currentTab} onChangeTab={setCurrentTab} />

          {currentTab === 'ingredientes' && <IngredientsTableView ingredients={ingredients} />}

          {currentTab === 'movimientos' && (
            <>
              <MovementsView movements={movements} ingredients={ingredients} />
              <TodayMovementsCard items={mockTodayMovements} />
            </>
          )}
        </>
      )}
    </div>
  );
}
