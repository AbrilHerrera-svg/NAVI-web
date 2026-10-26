import { useState } from 'react';
import * as Icons from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import type { ProfileInfo } from '../types';

interface Props {
  profile: ProfileInfo;
  onSave: (profile: ProfileInfo) => void;
}

export const ProfileCard = ({ profile, onSave }: Props) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  return (
    <Card className="shadow-xs">
      <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <Icons.User size={28} />
        </div>
        <div>
          <h2 className="font-bold text-sm text-slate-900">{name}</h2>
          <Badge color="brand" className="mt-1 inline-block">
            {profile.role}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Rol</label>
          <div className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-500 bg-slate-50">
            {profile.role}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
        <Button onClick={() => onSave({ ...profile, name, email, phone })} className="px-5 py-2">
          Guardar cambios
        </Button>
      </div>
    </Card>
  );
};
