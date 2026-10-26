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
  NewPromotionModal,
  EditPromotionModal,
  mockMenuItems,
  mockPromotions,
  type MenuTab,
  type MenuItem,
  type PromotionItem,
} from '../features/menu';
import { useInventory, type RecipeLine } from '../features/inventory';

export default function MenuPage() {
  const { updateRecipe } = useInventory();
  const [currentTab, setCurrentTab] = useState<MenuTab>('lista');
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [promotions, setPromotions] = useState<PromotionItem[]>(mockPromotions);

  // Sub-vistas (Receta y Nuevo Producto)
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState<MenuItem | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Estados de los Modales
  const [archiveTarget, setArchiveTarget] = useState<MenuItem | null>(null);
  const [removePromoTarget, setRemovePromoTarget] = useState<PromotionItem | null>(null);
  const [pendingRecipeLines, setPendingRecipeLines] = useState<RecipeLine[] | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isNewPromoOpen, setIsNewPromoOpen] = useState(false);
  const [editPromoTarget, setEditPromoTarget] = useState<PromotionItem | null>(null);

  // Toggle switch de disponibilidad (también sincroniza el estado Activo/Inactivo)
  const handleToggleAvailable = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, available: !item.available, status: item.available ? 'Inactivo' : 'Activo' }
          : item
      )
    );
  };

  // Confirmar archivar
  const handleConfirmArchive = () => {
    if (!archiveTarget) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === archiveTarget.id ? { ...item, status: 'Archivado', available: false } : item
      )
    );
    setArchiveTarget(null);
  };

  // Desarchivar: regresa el producto a Activo y disponible
  const handleUnarchive = (item: MenuItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'Activo', available: true } : i))
    );
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
          onRequestSave={(lines) => setPendingRecipeLines(lines)}
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
            onOpenNewPromotion={() => setIsNewPromoOpen(true)}
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

          {currentTab === 'promociones' && (
            <PromotionsTableView
              promotions={promotions}
              onRequestRemove={setRemovePromoTarget}
              onToggleActive={(promo) =>
                setPromotions((prev) =>
                  prev.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p))
                )
              }
              onEdit={setEditPromoTarget}
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

      <NewPromotionModal
        isOpen={isNewPromoOpen}
        onClose={() => setIsNewPromoOpen(false)}
        onCreate={(promo) => setPromotions((prev) => [...prev, promo])}
      />

      <EditPromotionModal
        promo={editPromoTarget}
        onClose={() => setEditPromoTarget(null)}
        onSave={(updated) =>
          setPromotions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        }
      />
    </div>
  );
}