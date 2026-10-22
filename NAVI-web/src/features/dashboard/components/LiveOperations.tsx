export const LiveOperations = () => {
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-3">Operación en vivo</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cola de pedidos */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Cola de pedidos</h3>
          <ul className="text-xs space-y-2 text-gray-600">
            <li className="flex justify-between"><span>Nuevo</span> <span className="font-bold">2</span></li>
            <li className="flex justify-between"><span>En preparación</span> <span className="font-bold">2</span></li>
            <li className="flex justify-between"><span>Listo</span> <span className="font-bold">1</span></li>
            <li className="flex justify-between"><span>Por cobrar</span> <span className="font-bold">1</span></li>
            <li className="flex justify-between text-red-500"><span>Cancelados hoy</span> <span className="font-bold">1</span></li>
          </ul>
        </div>

        {/* Pedidos atrasados */}
        <div className="bg-white border rounded-xl p-4 shadow-sm col-span-2">
          <h3 className="font-semibold text-sm mb-3">Pedidos atrasados</h3>
          <ul className="text-xs space-y-3">
            <li className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">#88 · Chilaquiles rojos · App</span>
              <span className="text-red-500 font-semibold">atrasado +8 min</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">#91 · Biscoff Smoothie · Mostrador</span>
              <span className="text-red-500 font-semibold">atrasado +5 min</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium text-gray-700">#94 · Waffle Dulce · App</span>
              <span className="text-amber-600 font-semibold">vence 10:52</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};