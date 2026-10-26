import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export const SecurityCard = () => {
  return (
    <Card className="shadow-xs">
      <h3 className="font-bold text-sm text-slate-800 mb-3">Seguridad</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-700 font-medium">Contraseña</p>
          <p className="text-xs text-slate-400">Última actualización: hace 3 meses</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => alert('Funcionalidad de cambio de contraseña próximamente')}
          className="px-4 py-2"
        >
          Cambiar contraseña
        </Button>
      </div>
    </Card>
  );
};
