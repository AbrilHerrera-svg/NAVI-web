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
  IngredientFormModal,
  DeleteIngredientModal,
  mockTodayMovements,
  useInventory,
  type InventoryIngredient,
  type InventoryTab,
  type InventoryView,
} from '../features/inventory';

export default function InventoryPage() {
  const { ingredients, movements, adjustStock, registerPurchase, createIngredient, updateIngredient, deleteIngredient } =
    useInventory();
  const [view, setView] = useState<InventoryView>('inventario');
  const [currentTab, setCurrentTab] = useState<InventoryTab>('ingredientes');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<InventoryIngredient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryIngredient | null>(null);
  const [deleteBlockedReason, setDeleteBlockedReason] = useState<string | null>(null);

  // Regresa a la vista principal mostrando el historial para ver el movimiento recién creado
  const backToMovements = () => {
    setCurrentTab('movimientos');
    setView('inventario');
  };

  const handleRequestDelete = (ingredient: InventoryIngredient) => {
    setDeleteTarget(ingredient);
    setDeleteBlockedReason(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const result = deleteIngredient(deleteTarget.id);
    if (!result.ok) {
      setDeleteBlockedReason(result.reason ?? 'No se pudo eliminar.');
      return;
    }
    setDeleteTarget(null);
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
            onNewIngredient={() => {
              setEditingIngredient(null);
              setIsFormOpen(true);
            }}
          />

          <InventoryMetrics ingredients={ingredients} />

          <InventoryTabs currentTab={currentTab} onChangeTab={setCurrentTab} />

          {currentTab === 'ingredientes' && (
            <IngredientsTableView
              ingredients={ingredients}
              onEdit={(ingredient) => {
                setEditingIngredient(ingredient);
                setIsFormOpen(true);
              }}
              onDelete={handleRequestDelete}
            />
          )}

          {currentTab === 'movimientos' && (
            <>
              <MovementsView movements={movements} ingredients={ingredients} />
              <TodayMovementsCard items={mockTodayMovements} />
            </>
          )}
        </>
      )}

      <IngredientFormModal
        key={isFormOpen ? (editingIngredient?.id ?? 'new') : 'closed'}
        isOpen={isFormOpen}
        ingredient={editingIngredient}
        onClose={() => setIsFormOpen(false)}
        onCreate={createIngredient}
        onUpdate={updateIngredient}
      />

      <DeleteIngredientModal
        ingredient={deleteTarget}
        blockedReason={deleteBlockedReason}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
