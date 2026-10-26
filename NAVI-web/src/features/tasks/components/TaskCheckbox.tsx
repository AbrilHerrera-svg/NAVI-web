import * as Icons from 'lucide-react';

interface Props {
  checked: boolean;
  label: string; // para lectores de pantalla
  onToggle: () => void;
}

export const TaskCheckbox = ({ checked, label, onToggle }: Props) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition cursor-pointer ${
        checked ? 'bg-[#5960A1] border-[#5960A1] text-white' : 'bg-white border-slate-300 hover:border-[#5960A1]'
      }`}
    >
      {checked && <Icons.Check size={13} strokeWidth={3} />}
    </button>
  );
};