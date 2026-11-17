import { useState } from 'react';
import type { ProductItem, CartItem, SelectedItemExtra, OrderPaymentMethod } from '../features/orders/types';
import { OrderCatalog } from '../features/orders/components/OrderCatalog';
import { OrderExtrasView } from '../features/orders/components/OrderExtrasView';
import { OrderSummarySidebar } from '../features/orders/components/OrderSummarySidebar';
import { OrderConfirmModal } from '../features/orders/components/OrderConfirmModal';
import { buildStockLines, canAddProductToCart } from '../features/orders/utils/buildStockLines';
import { menuItemToProductVariants } from '../features/orders/utils/menuToCatalog';
import { estimateOrderTime } from '../features/orders/utils/estimateOrderTime';
import { useOrders } from '../features/orders';
import { useInventory } from '../features/inventory';
import { useMenu, isMenuItemOrderableToday } from '../features/menu';

export default function NewOrderPage() {
  const { ingredients, registerSale, recipesByProductId } = useInventory();
  const { orders, addOrder } = useOrders();
  const { items: menuItems } = useMenu();

  // Catálogo del mostrador = productos del Menú disponibles hoy (inactivos/archivados
  // desde Menú no se pueden vender aquí, igual que los de fin de semana en día de semana).
  const products = menuItems
    .filter((item) => isMenuItemOrderableToday(item))
    .flatMap(menuItemToProductVariants);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [activeExtraProduct, setActiveExtraProduct] = useState<ProductItem | null>(null);
  // Índice del renglón del carrito que se está editando (null = se está agregando uno nuevo).
  const [editingCartIndex, setEditingCartIndex] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<OrderPaymentMethod>('Efectivo');

  // Tiempo que se le comunica al cliente antes de confirmar: el de su propio pedido más
  // lo que suma la fila de pedidos que ya están en curso.
  const pendingOrdersAhead = orders.filter((o) => o.status === 'Nuevo' || o.status === 'En preparación').length;
  const estimate = estimateOrderTime(cart, pendingOrdersAhead);

  // Regla de negocio: si ya no hay existencia suficiente de algún ingrediente de la receta,
  // el producto no se puede agregar al pedido (ni directo ni con extras).
  const isProductAvailable = (product: ProductItem) =>
    canAddProductToCart(product, cart, ingredients, recipesByProductId);

  // Agregar producto directo
  const handleAddDirect = (product: ProductItem) => {
    if (!isProductAvailable(product)) return;
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.product.size === product.size && item.extras.length === 0
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, extras: [] }];
    });
  };

  // Guardar producto con extras seleccionados (nuevo renglón o edición de uno existente)
  const handleAddWithExtras = (extras: SelectedItemExtra[]) => {
    if (!activeExtraProduct) return;

    if (editingCartIndex !== null) {
      setCart((prev) => prev.map((item, i) => (i === editingCartIndex ? { ...item, extras } : item)));
      setActiveExtraProduct(null);
      setEditingCartIndex(null);
      return;
    }

    if (!isProductAvailable(activeExtraProduct)) return;
    setCart((prev) => [...prev, { product: activeExtraProduct, quantity: 1, extras }]);
    setActiveExtraProduct(null);
  };

  // Editar los extras de un renglón ya agregado al carrito (solo bebidas)
  const handleEditExtras = (index: number) => {
    setEditingCartIndex(index);
    setActiveExtraProduct(cart[index].product);
  };

  // Quitar una unidad del producto; si queda en 0, lo quita del carrito
  const handleRemoveItem = (index: number) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === index ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Confirmar: descuenta inventario según receta y, solo si alcanza, limpia el carrito
  // y manda el pedido a la cola compartida de Pedidos (ya cobrado).
  const handleFinalizeOrder = () => {
    setIsConfirmOpen(false);

    const lines = buildStockLines(cart, ingredients, recipesByProductId);
    const result = registerSale(`Pedido mostrador · ${new Date().toLocaleTimeString('es-MX')}`, lines);

    if (!result.ok) {
      alert(
        `No se puede confirmar: no alcanza el inventario de ${result.missing
          .map((m) => m.ingredientName)
          .join(', ')}.`
      );
      return;
    }

    const productsTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const extrasTotal = cart.reduce((acc, item) => {
      const itemExtras = item.extras.reduce((eAcc, e) => eAcc + e.price * e.quantity, 0);
      return acc + itemExtras * item.quantity;
    }, 0);

    addOrder({
      origin: 'Mostrador',
      cart,
      total: productsTotal + extrasTotal,
      alreadyCharged: true,
      paymentMethod: pendingPaymentMethod,
    });

    alert('¡Pedido confirmado y enviado a preparación!');
    setCart([]);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Columna Izquierda: Alterna entre Catálogo y Selección de Extras */}
      {activeExtraProduct ? (
        <OrderExtrasView
          product={activeExtraProduct}
          initialExtras={editingCartIndex !== null ? cart[editingCartIndex].extras : []}
          isEditing={editingCartIndex !== null}
          onBack={() => {
            setActiveExtraProduct(null);
            setEditingCartIndex(null);
          }}
          onConfirm={handleAddWithExtras}
        />
      ) : (
        <OrderCatalog
          products={products}
          onAddProduct={handleAddDirect}
          onOpenExtras={(prod) => setActiveExtraProduct(prod)}
          isAvailable={isProductAvailable}
        />
      )}

      {/* Columna Derecha: Resumen del Pedido */}
      <OrderSummarySidebar
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onEditExtras={handleEditExtras}
        onRequestConfirm={(method) => {
          setPendingPaymentMethod(method);
          setIsConfirmOpen(true);
        }}
      />

      {/* Modal Confirmación */}
      <OrderConfirmModal
        isOpen={isConfirmOpen}
        estimate={estimate}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinalizeOrder}
      />
    </div>
  );
}