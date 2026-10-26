import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import type { BusinessInfo } from '../types';

interface Props {
  info: BusinessInfo;
  onSave: (info: BusinessInfo) => void;
}

export const BusinessInfoCard = ({ info, onSave }: Props) => {
  const [name, setName] = useState(info.name);
  const [address, setAddress] = useState(info.address);
  const [phone, setPhone] = useState(info.phone);
  const [hours, setHours] = useState(info.hours);

  return (
    <Card className="shadow-xs">
      <h3 className="font-bold text-sm text-slate-800 mb-4">Información del negocio</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del negocio</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Horario</label>
          <input
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
        <Button
          onClick={() => onSave({ name, address, phone, hours })}
          className="px-5 py-2"
        >
          Guardar cambios
        </Button>
      </div>
    </Card>
  );
};
