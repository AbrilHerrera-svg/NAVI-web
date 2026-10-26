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
  mockIngredients,
  mockMovements,
  mockTodayMovements,
  mockNextPurchaseFolio,
  roundBoxes,
  type InventoryTab,
  type InventoryView,
  type InventoryIngredient,
  type InventoryMovement,
  type StockAdjustmentInput,
  type PurchaseInput,
} from '../features/inventory';

// Etiqueta de fecha para movimientos nuevos: la fecha capturada (o "Hoy") + hora actual
const buildDateLabel = (date: string) => {
  const time = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${date.trim() || 'Hoy'} · ${time}`;
};

export default function InventoryPage() {
  const [view, setView] = useState<InventoryView>('inventario');
  const [currentTab, setCurrentTab] = useState<InventoryTab>('ingredientes');
  const [ingredients, setIngredients] = useState<InventoryIngredient[]>(mockIngredients);
  const [movements, setMovements] = useState<InventoryMovement[]>(mockMovements);
  const [purchaseFolio, setPurchaseFolio] = useState(mockNextPurchaseFolio);

  // Regresa a la vista principal mostrando el historial para ver el movimiento recién creado
  const backToMovements = () => {
    setCurrentTab('movimientos');
    setView('inventario');
  };

  // Guardar ajuste: la existencia pasa a las cajas contadas y se registra la diferencia
  const handleSaveAdjustment = (input: StockAdjustmentInput) => {
    const ingredient = ingredients.find((i) => i.id === input.ingredientId);
    if (!ingredient) return;

    const difference = roundBoxes(input.countedBoxes - ingredient.stock);

    setIngredients((prev) =>
      prev.map((i) => (i.id === ingredient.id ? { ...i, stock: input.countedBoxes } : i))
    );
    setMovements((prev) => [
      {
        id: `mov-${Date.now()}`,
        dateLabel: buildDateLabel(input.date),
        type: input.type,
        ingredientName: ingredient.name,
        quantity: difference,
        reference: [input.reason, input.reference, input.responsible].filter(Boolean).join(' · '),
        notes: input.notes || undefined,
      },
      ...prev,
    ]);
    backToMovements();
  };

  // Registrar compra: suma las cajas recibidas a la existencia actual
  const handleRegisterPurchase = (input: PurchaseInput) => {
    const ingredient = ingredients.find((i) => i.id === input.ingredientId);
    if (!ingredient) return;

    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredient.id ? { ...i, stock: roundBoxes(i.stock + input.receivedBoxes) } : i
      )
    );
    setMovements((prev) => [
      {
        id: `mov-${Date.now()}`,
        dateLabel: buildDateLabel(input.date),
        type: 'Compra',
        ingredientName: ingredient.name,
        quantity: input.receivedBoxes,
        reference: `PUR-${purchaseFolio} · ${input.supplier} · $${input.totalCost.toLocaleString('es-MX')}`,
        notes: input.notes || undefined,
      },
      ...prev,
    ]);
    setPurchaseFolio((folio) => folio + 1);
    backToMovements();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Formulario de Ajuste de existencias */}
      {view === 'ajuste' ? (
        <AdjustStockForm
          ingredients={ingredients}
          onCancel={() => setView('inventario')}
          onSubmit={handleSaveAdjustment}
        />
      ) : view === 'compra' ? (
        /* 2. Formulario de Registro de compra */
        <RegisterPurchaseForm
          ingredients={ingredients}
          onCancel={() => setView('inventario')}
          onSubmit={handleRegisterPurchase}
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
