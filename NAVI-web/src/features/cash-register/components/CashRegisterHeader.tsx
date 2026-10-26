interface Props {
  dateLabel: string;
}

export const CashRegisterHeader = ({ dateLabel }: Props) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Caja</h1>
      <p className="text-xs text-slate-400 mt-0.5">{dateLabel}</p>
    </div>
  );
};
