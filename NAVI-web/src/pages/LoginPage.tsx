import { LoginForm } from "../features/auth";

interface Props {
  onLogin: (email: string, password: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <LoginForm onLogin={onLogin} />
    </div>
  );
}
