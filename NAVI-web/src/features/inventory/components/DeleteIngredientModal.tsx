import Button from '../../../components/ui/Button';
import type { InventoryIngredient } from '../types';

interface Props {
  ingredient: InventoryIngredient | null;
  // Motivo por el que no se puede borrar (null = sí se puede, pide confirmación normal).
  blockedReason: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteIngredientModal = ({ ingredient, blockedReason, onClose, onConfirm }: Props) => {
  if (!ingredient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {blockedReason ? (
          <>
            <h3 className="text-base font-bold text-slate-800">No se puede eliminar {ingredient.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{blockedReason}</p>
            <Button variant="secondary" onClick={onClose} className="w-full py-2 px-3">
              Entendido
            </Button>
          </>
        ) : (
          <>
            <h3 className="text-base font-bold text-slate-800">¿Eliminar {ingredient.name}?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Esta acción no se puede deshacer. El ingrediente ya no aparecerá en el inventario.
            </p>
            <div className="flex gap-3 w-full pt-2">
              <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
                Cancelar
              </Button>
              <Button variant="danger" onClick={onConfirm} className="flex-1 py-2 px-3">
                Sí, eliminar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
