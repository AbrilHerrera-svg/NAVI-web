import { useState } from 'react';
import type { ProductItem, CartItem, SelectedItemExtra } from '../features/orders/types';
import { OrderCatalog } from '../features/orders/components/OrderCatalog';
import { OrderExtrasView } from '../features/orders/components/OrderExtrasView';
import { OrderSummarySidebar } from '../features/orders/components/OrderSummarySidebar';
import { OrderConfirmModal } from '../features/orders/components/OrderConfirmModal';

export default function NewOrderPage() {
  // Estado inicial simulado con los 2 productos de la captura
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: { id: '1', name: 'Chai Milk Tea', category: 'Bebidas', categoryLabel: 'Té con leche', size: 'GDE', price: 85 },
      quantity: 1,
      extras: [{ extraId: 'top-1', name: 'Topping Oreo', price: 15, quantity: 1 }],
    },
    {
      product: { id: '2', name: 'Taro Smoothie', category: 'Bebidas', categoryLabel: 'Smoothies', size: 'MED', price: 65 },
      quantity: 1,
      extras: [],
    },
  ]);

  const [activeExtraProduct, setActiveExtraProduct] = useState<ProductItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Agregar producto directo
  const handleAddDirect = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.extras.length === 0);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.extras.length === 0
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, extras: [] }];
    });
  };

  // Guardar producto con extras seleccionados
  const handleAddWithExtras = (extras: SelectedItemExtra[]) => {
    if (!activeExtraProduct) return;
    setCart((prev) => [...prev, { product: activeExtraProduct, quantity: 1, extras }]);
    setActiveExtraProduct(null);
  };

  // Quitar una unidad del producto; si queda en 0, lo quita del carrito
  const handleRemoveItem = (index: number) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === index ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Confirmar y limpiar
  const handleFinalizeOrder = () => {
    setIsConfirmOpen(false);
    alert('¡Pedido confirmado y enviado a preparación!');
    setCart([]);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Columna Izquierda: Alterna entre Catálogo y Selección de Extras */}
      {activeExtraProduct ? (
        <OrderExtrasView
          product={activeExtraProduct}
          onBack={() => setActiveExtraProduct(null)}
          onConfirm={handleAddWithExtras}
        />
      ) : (
        <OrderCatalog
          onAddProduct={handleAddDirect}
          onOpenExtras={(prod) => setActiveExtraProduct(prod)}
        />
      )}

      {/* Columna Derecha: Resumen del Pedido */}
      <OrderSummarySidebar
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onRequestConfirm={() => setIsConfirmOpen(true)}
      />

      {/* Modal Confirmación */}
      <OrderConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinalizeOrder}
      />
    </div>
  );
}