import { useState } from 'react';
import {
  MenuNavHeader,
  MenuTableView,
  MenuCardsView,
  PromotionsTableView,
  ProductRecipeView,
  NewProductForm,
  ArchiveProductModal,
  RemovePromoModal,
  SaveRecipeModal,
  CreateProductModal,
  mockMenuItems,
  mockPromotions,
  type MenuTab,
  type MenuItem,
  type PromotionItem,
} from '../features/menu';

export default function MenuPage() {
  const [currentTab, setCurrentTab] = useState<MenuTab>('lista');
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [promotions, setPromotions] = useState<PromotionItem[]>(mockPromotions);

  // Sub-vistas (Receta y Nuevo Producto)
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState<MenuItem | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Estados de los Modales
  const [archiveTarget, setArchiveTarget] = useState<MenuItem | null>(null);
  const [removePromoTarget, setRemovePromoTarget] = useState<PromotionItem | null>(null);
  const [isSaveRecipeOpen, setIsSaveRecipeOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  // Toggle switch de disponibilidad
  const handleToggleAvailable = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  // Confirmar archivar
  const handleConfirmArchive = () => {
    if (!archiveTarget) return;
    setItems((prev) =>
      prev.map((item) => (item.id === archiveTarget.id ? { ...item, status: 'Archivado' } : item))
    );
    setArchiveTarget(null);
  };

  // Confirmar quitar promoción
  const handleConfirmRemovePromo = () => {
    if (!removePromoTarget) return;
    setPromotions((prev) => prev.filter((p) => p.id !== removePromoTarget.id));
    setRemovePromoTarget(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Vista de Receta */}
      {selectedRecipeProduct ? (
        <ProductRecipeView
          product={selectedRecipeProduct}
          onBack={() => setSelectedRecipeProduct(null)}
          onRequestSave={() => setIsSaveRecipeOpen(true)}
        />
      ) : isCreatingProduct ? (
        /* 2. Formulario de Alta de Producto */
        <NewProductForm
          onCancel={() => setIsCreatingProduct(false)}
          onSubmit={() => setIsCreateProductOpen(true)}
        />
      ) : (
        /* 3. Vistas Principales (Lista, Tarjetas o Promociones) */
        <>
          <MenuNavHeader
            currentTab={currentTab}
            onChangeTab={setCurrentTab}
            onOpenNewProduct={() => setIsCreatingProduct(true)}
            title={currentTab === 'promociones' ? 'Promociones' : 'Menú'}
            subtitle={
              currentTab === 'promociones'
                ? 'Descuentos y ofertas para artículos del menú'
                : 'Precios, tamaños y disponibilidad'
            }
          />

          {currentTab === 'lista' && (
            <MenuTableView
              items={items}
              onToggleAvailable={handleToggleAvailable}
              onRequestArchive={setArchiveTarget}
              onOpenRecipe={setSelectedRecipeProduct}
            />
          )}

          {currentTab === 'tarjetas' && (
            <MenuCardsView
              items={items}
              onOpenRecipe={setSelectedRecipeProduct}
            />
          )}

          {currentTab === 'promociones' && (
            <PromotionsTableView
              promotions={promotions}
              onRequestRemove={setRemovePromoTarget}
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

      <RemovePromoModal
        isOpen={!!removePromoTarget}
        onClose={() => setRemovePromoTarget(null)}
        onConfirm={handleConfirmRemovePromo}
      />

      <SaveRecipeModal
        isOpen={isSaveRecipeOpen}
        onClose={() => setIsSaveRecipeOpen(false)}
        onConfirm={() => {
          setIsSaveRecipeOpen(false);
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