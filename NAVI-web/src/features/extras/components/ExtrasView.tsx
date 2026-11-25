import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useExtras } from '../context/useExtras';
import { notify, confirmDialog } from '../../../components/ui/notify';

// Administra el catálogo de extras/toppings (nombre, precio, disponibilidad);
// lo mismo que usa el flujo de "Agregar extras" al armar un pedido.
export const ExtrasView = () => {
  const { items, loading, error, reload, createExtra, updateExtra, deleteExtra } = useExtras();
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [creando, setCreando] = useState(false);

  const handleCrear = async () => {
    const precioNum = Number(precio);
    if (!nombre.trim() || Number.isNaN(precioNum) || precioNum < 0) return;

    setCreando(true);
    const resultado = await createExtra({ name: nombre.trim(), price: precioNum, available: true });
    setCreando(false);

    if (resultado.ok) {
      setNombre('');
      setPrecio('');
    } else if (resultado.reason) {
      alert(resultado.reason);
    }
  };

  const handleToggle = async (id: string, available: boolean) => {
    const resultado = await updateExtra(id, { available: !available });
    if (!resultado.ok && resultado.reason) alert(resultado.reason);
  };

  const handleEliminar = async (id: string, name: string) => {
  const accepted = await confirmDialog({
    title: `¿Eliminar "${name}"?`,
    message: 'Esto no borra lo ya vendido.',
    confirmLabel: 'Eliminar',
    variant: 'danger',
  });
  if (!accepted) return;
  const resultado = await deleteExtra(id);
  if (!resultado.ok && resultado.reason) notify.error(resultado.reason);
};

  return (
    <div className="space-y-6">
      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
          <span>{error}</span>
          <button onClick={reload} className="font-semibold underline cursor-pointer">
            Reintentar
          </button>
        </div>
      )}

      <Card className="shadow-xs">
        <h3 className="font-bold text-sm text-slate-800 mb-4">Agregar extra</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nombre (ej. Topping Oreo)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="sm:w-32 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
          <Button onClick={handleCrear} disabled={creando} className="px-5 py-2">
            Agregar
          </Button>
        </div>
      </Card>

      <Card className="shadow-xs">
        <h3 className="font-bold text-sm text-slate-800 mb-4">Catálogo de extras</h3>

        {loading && <p className="text-sm text-slate-400">Cargando...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-400">Todavía no hay extras.</p>}

        <div className="divide-y divide-slate-100">
          {items.map((extra) => (
            <div key={extra.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{extra.name}</p>
                <p className="text-xs text-slate-400">${extra.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggle(extra.id, extra.available)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    extra.available ? 'bg-[#5960A1]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                      extra.available ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleEliminar(extra.id, extra.name)}
                  className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
