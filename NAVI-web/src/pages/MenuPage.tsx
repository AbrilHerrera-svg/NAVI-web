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

export default function MenuPage() {
  const { updateRecipe } = useInventory();
  const { items, toggleAvailable, archiveProduct, unarchiveProduct } = useMenu();
  const [currentTab, setCurrentTab] = useState<MenuTab>('lista');

  // Sub-vistas (Receta y Nuevo Producto)
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState<MenuItem | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Estados de los Modales
  const [archiveTarget, setArchiveTarget] = useState<MenuItem | null>(null);
  const [pendingRecipeLines, setPendingRecipeLines] = useState<RecipeLine[] | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  // Confirmar archivar
  const handleConfirmArchive = () => {
    if (!archiveTarget) return;
    archiveProduct(archiveTarget.id);
    setArchiveTarget(null);
  };

  // Desarchivar: regresa el producto a Activo y disponible
  const handleUnarchive = (item: MenuItem) => {
    unarchiveProduct(item.id);
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

          {currentTab === 'lista' && (
            <MenuTableView
              items={items}
              onToggleAvailable={toggleAvailable}
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