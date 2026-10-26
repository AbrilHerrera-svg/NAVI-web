import Card from '../../../components/ui/Card';
import type { NotificationSetting } from '../types';

interface Props {
  items: NotificationSetting[];
  onToggle: (id: string) => void;
}

export const NotificationsCard = ({ items, onToggle }: Props) => {
  return (
    <Card className="shadow-xs">
      <h3 className="font-bold text-sm text-slate-800 mb-4">Notificaciones</h3>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                item.enabled ? 'bg-[#5960A1]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                  item.enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};
