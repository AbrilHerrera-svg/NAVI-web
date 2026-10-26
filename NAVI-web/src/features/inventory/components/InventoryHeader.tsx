import Button from '../../../components/ui/Button';

interface Props {
  onAdjustStock: () => void;
  onRegisterPurchase: () => void;
}

export const InventoryHeader = ({ onAdjustStock, onRegisterPurchase }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventario</h1>
        <p className="text-xs text-slate-400 mt-0.5">Ingredientes, existencias y movimientos</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onAdjustStock} className="bg-white">
          Ajustar existencias
        </Button>
        <Button onClick={onRegisterPurchase}>Registrar compra</Button>
      </div>
    </div>
  );
};
