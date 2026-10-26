import Button from '../../../components/ui/Button';

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
          <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
            Mantener en el menú
          </Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1 py-2 px-3">
            Sí, archivar
          </Button>
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
          <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
            Mantener promoción
          </Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1 py-2 px-3">
            Sí, quitar
          </Button>
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
          <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
            Seguir editando
          </Button>
          <Button variant="success" onClick={onConfirm} className="flex-1 py-2 px-3">
            Sí, guardar cambios
          </Button>
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
          <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
            Regresar al formulario
          </Button>
          <Button variant="success" onClick={onConfirm} className="flex-1 py-2 px-3">
            Sí, agregar producto
          </Button>
        </div>
      </div>
    </div>
  );
};