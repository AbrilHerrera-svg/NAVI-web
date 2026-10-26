import { useState, type FormEvent } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { IngredientSearchInput } from './IngredientSearchInput';
import { formatMoney, type InventoryIngredient, type PaymentMethod, type PurchaseInput } from '../types';

interface Props {
  ingredients: InventoryIngredient[];
  onCancel: () => void;
  onSubmit: (input: PurchaseInput) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]';

const parseCost = (value: string) => parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
const todayISO = () => new Date().toISOString().slice(0, 10);

export const RegisterPurchaseForm = ({ ingredients, onCancel, onSubmit }: Props) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<InventoryIngredient | null>(null);
  const [notes, setNotes] = useState('');
  const [receivedBoxes, setReceivedBoxes] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(todayISO());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');

  const received = parseFloat(receivedBoxes) || 0;
  const total = parseCost(totalCost);
  const costPerBox = received > 0 && total > 0 ? total / received : null;

  const canSave =
    !!selected &&
    received > 0 &&
    total > 0 &&
    supplier.trim().length > 0 &&
    paymentMethod !== '' &&
    date.trim().length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    onSubmit({
      ingredientId: selected.id,
      receivedBoxes: received,
      totalCost: total,
      notes: notes.trim(),
      supplier: supplier.trim(),
      date,
      paymentMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Registrar compra</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Suma existencias de un ingrediente y guarda su costo. Una compra no se puede editar.
        </p>
      </div>

      <Card className="rounded-2xl shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900">Compra</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Ingrediente</label>
          <IngredientSearchInput
            ingredients={ingredients}
            query={query}
            onQueryChange={(value) => {
              setQuery(value);
              setSelected(null);
            }}
            onSelect={(ingredient) => {
              setSelected(ingredient);
              setQuery(ingredient.name);
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Notas</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Factura, proveedor o notas (opcional)"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Cajas recibidas</label>
            <input
              type="text"
              inputMode="decimal"
              value={receivedBoxes}
              onChange={(e) => setReceivedBoxes(e.target.value)}
              placeholder="ej. 2 cajas"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Costo total</label>
            <input
              type="text"
              inputMode="decimal"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="$0.00 MXN"
              className={inputClass}
            />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900">Proveedor y pago</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Proveedor</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Distribuidora o proveedor"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Fecha de compra</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayISO()}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Costo por caja</label>
            <input
              type="text"
              readOnly
              value={costPerBox !== null ? `${formatMoney(costPerBox)} MXN` : ''}
              placeholder="Se calcula automáticamente"
              className={`${inputClass} bg-slate-50 text-slate-500`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Método de pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod | '')}
              className={`${inputClass} bg-white ${paymentMethod ? 'text-slate-800' : 'text-slate-400'}`}
            >
              <option value="" disabled>
                Efectivo, tarjeta o transferencia
              </option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <div className="bg-[#5960A1]/10 rounded-xl p-3 text-xs text-[#5960A1] font-medium">
          Las cajas se suman a la existencia actual. Costo por caja = costo total ÷ cajas recibidas. Una
          compra no se puede editar.
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="px-5 py-2">
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!canSave}
          className="px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Registrar compra
        </Button>
      </div>
    </form>
  );
};
