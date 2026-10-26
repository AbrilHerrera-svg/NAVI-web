import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

interface Props {
  pendingRequired: number;
  onGoToCashRegister: () => void;
}

// El cierre del día vive en Caja; aquí solo se habilita cuando la checklist de cierre está completa.
export const CloseDayBanner = ({ pendingRequired, onGoToCashRegister }: Props) => {
  const ready = pendingRequired === 0;

  return (
    <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 className="font-bold text-sm text-slate-800">
          {ready ? 'Lista de cierre completa' : 'Completa la lista de cierre para cerrar el día'}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {ready
            ? 'Ya puedes ir a Caja para contar el efectivo y cerrar el día.'
            : `Faltan ${pendingRequired} ${pendingRequired === 1 ? 'tarea requerida' : 'tareas requeridas'} de cierre. El botón se habilita al terminarlas.`}
        </p>
      </div>
      <Button
        onClick={onGoToCashRegister}
        disabled={!ready}
        className="shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Cerrar día
      </Button>
    </Card>
  );
};