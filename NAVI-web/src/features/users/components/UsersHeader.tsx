import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

interface Props {
  canManage: boolean;
  onAddUser: () => void;
}

export const UsersHeader = ({ canManage, onAddUser }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
        <p className="text-xs text-slate-400 mt-0.5">Equipo, roles y acceso a NAVI</p>
      </div>

      <div className="flex items-center gap-2">
        <Badge color="brand">Solo dueño</Badge>
        {canManage && <Button onClick={onAddUser}>Agregar usuario</Button>}
      </div>
    </div>
  );
};