// 1. Modal Archivar Producto
export const ArchiveProductModal = ({
  isOpen,
  productName,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-800">¿Archivar {productName}?</h3>
        <p className="text-xs text-slate-500">
          Pasa a Archivado y desaparece del menú. Puedes restaurarlo después.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
          >
            Mantener en el menú
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Sí, archivar
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Modal Quitar Promoción
export const RemovePromoModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-800">¿Quitar esta promoción?</h3>
        <p className="text-xs text-slate-500">
          Deja de aplicarse de inmediato. Queda en el historial como terminada.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
          >
            Mantener promoción
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Sí, quitar
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Modal Guardar Receta
export const SaveRecipeModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-800">¿Guardar cambios en esta receta?</h3>
        <p className="text-xs text-slate-500">
          Las ventas futuras usarán las nuevas cantidades. Las ventas pasadas conservan la receta con la que se hicieron.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
          >
            Seguir editando
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Sí, guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Modal Confirmar Alta de Producto
export const CreateProductModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-800">¿Agregar este producto al menú?</h3>
        <p className="text-xs text-slate-500">
          Este producto aparecerá en el menú y en Nuevo pedido, con la receta que ingresaste. Puedes editarlo después.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
          >
            Regresar al formulario
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Sí, agregar producto
          </button>
        </div>
      </div>
    </div>
  );
};