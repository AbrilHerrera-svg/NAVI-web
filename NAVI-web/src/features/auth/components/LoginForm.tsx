import { useState } from "react";
import naviLogo from "../../../assets/navi-cohete.svg";
import Button from "../../../components/ui/Button";

interface Props {
  // Devuelve el mensaje de error si el inicio de sesión falla, o null si salió bien
  onLogin: (email: string, password: string) => Promise<string | null>;
}

export const LoginForm = ({ onLogin }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const message = await onLogin(email, password);
    // si salió bien, esta pantalla se desmonta; solo se actualiza cuando hubo error
    if (message) {
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl shadow-xl p-8 space-y-6">
      <div className="flex items-center gap-2">
        <img src={naviLogo} alt="Navi" className="w-8 h-8" />
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: "22px",
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{ color: "#5960A1" }}>N</span>
          <span style={{ color: "#AC8572" }}>A</span>
          <span style={{ color: "#5960A1" }}>VI</span>
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Iniciar sesión</h1>
        <p className="text-sm text-slate-400 mt-1">Acceso de personal y dueño</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@navi.cafe"
            required
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full py-2.5 text-sm disabled:opacity-60">
          {loading ? "Entrando..." : "Iniciar sesión"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => alert("Funcionalidad de recuperación de contraseña próximamente")}
        className="text-sm text-[#5960A1] hover:underline cursor-pointer"
      >
        ¿Olvidaste tu contraseña?
      </button>
    </div>
  );
};