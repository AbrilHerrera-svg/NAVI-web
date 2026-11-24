import { useState } from 'react';
import {
  MenuNavHeader,
  MenuTableView,
  MenuCardsView,
  ProductRecipeView,
  NewProductForm,
  ArchiveProductModal,
  SaveRecipeModal,
  CreateProductModal,
  useMenu,
  type MenuTab,
  type MenuItem,
} from '../features/menu';
import { useInventory, type RecipeLine } from '../features/inventory';
import { ExtrasView } from '../features/extras';

export default function MenuPage() {
  const { updateRecipe } = useInventory();
  const { items, loading, error, reload, toggleAvailable, archiveProduct, unarchiveProduct } = useMenu();
  const [currentTab, setCurrentTab] = useState<MenuTab>('lista');

  // Sub-vistas (Receta y Nuevo Producto)
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState<MenuItem | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Estados de los Modales
  const [archiveTarget, setArchiveTarget] = useState<MenuItem | null>(null);
  const [pendingRecipeLines, setPendingRecipeLines] = useState<RecipeLine[] | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  // Si el servidor no pudo guardar el cambio, se avisa.
  const alertIfFailed = (result: { ok: boolean; reason?: string }) => {
    if (!result.ok && result.reason) alert(result.reason);
  };

  // Prender/apagar disponibilidad
  const handleToggleAvailable = async (id: string) => {
    alertIfFailed(await toggleAvailable(id));
  };

  // Confirmar archivar
  const handleConfirmArchive = async () => {
    if (!archiveTarget) return;
    const id = archiveTarget.id;
    setArchiveTarget(null);
    alertIfFailed(await archiveProduct(id));
  };

  // Desarchivar: regresa el producto a Activo y disponible
  const handleUnarchive = async (item: MenuItem) => {
    alertIfFailed(await unarchiveProduct(item.id));
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Vista de Receta */}
      {selectedRecipeProduct ? (
        <ProductRecipeView
          product={selectedRecipeProduct}
          onBack={() => setSelectedRecipeProduct(null)}
          onRequestSave={(lines) => setPendingRecipeLines(lines)}
        />
      ) : isCreatingProduct ? (
        /* 2. Formulario de Alta de Producto */
        <NewProductForm
          onCancel={() => setIsCreatingProduct(false)}
          onSubmit={() => setIsCreateProductOpen(true)}
        />
      ) : (
        /* 3. Vistas Principales (Lista o Tarjetas) */
        <>
          <MenuNavHeader
            currentTab={currentTab}
            onChangeTab={setCurrentTab}
            onOpenNewProduct={() => setIsCreatingProduct(true)}
          />

          {error && (
            <div role="alert" className="flex items-center justify-between gap-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              <span>{error}</span>
              <button onClick={reload} className="font-semibold underline cursor-pointer">
                Reintentar
              </button>
            </div>
          )}

          {loading && items.length === 0 && <p className="text-sm text-slate-400">Cargando menú...</p>}

          {currentTab === 'lista' && (
            <MenuTableView
              items={items}
              onToggleAvailable={handleToggleAvailable}
              onRequestArchive={setArchiveTarget}
              onUnarchive={handleUnarchive}
              onOpenRecipe={setSelectedRecipeProduct}
            />
          )}

          {currentTab === 'tarjetas' && (
            <MenuCardsView
              items={items}
              onOpenRecipe={setSelectedRecipeProduct}
            />
          )}

          {currentTab === 'extras' && <ExtrasView />}
        </>
      )}

      {/* Modales */}
      <ArchiveProductModal
        isOpen={!!archiveTarget}
        productName={archiveTarget?.name || ''}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleConfirmArchive}
      />

      <SaveRecipeModal
        isOpen={pendingRecipeLines !== null}
        onClose={() => setPendingRecipeLines(null)}
        onConfirm={() => {
          if (selectedRecipeProduct && pendingRecipeLines) {
            updateRecipe(selectedRecipeProduct.id, pendingRecipeLines);
          }
          setPendingRecipeLines(null);
          setSelectedRecipeProduct(null);
        }}
      />

      <CreateProductModal
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        onConfirm={() => {
          setIsCreateProductOpen(false);
          setIsCreatingProduct(false);
        }}
      />
    </div>
  );
}