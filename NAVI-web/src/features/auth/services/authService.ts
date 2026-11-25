import { apiFetch, clearTokens, setTokens } from '../../../lib/api';
import type { ProfileInfo } from '../../profile/types';

interface LoginResponse {
  token: string;
  refreshToken: string;
  perfil: ProfileInfo;
}

// Valida correo y contraseña contra el backend (Firebase Auth) y guarda los tokens.
export const login = async (email: string, password: string): Promise<ProfileInfo> => {
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });

  setTokens({ token: data.token, refreshToken: data.refreshToken });
  return data.perfil;
};

export const recoverPassword = (email: string) =>
  apiFetch<{ mensaje: string }>('/auth/recover', {
    method: 'POST',
    body: { email },
    auth: false,
  });

export const logout = () => clearTokens();

// Compatibilidad: menú, pedidos y ventas piden datos con peticionAuth(ruta, { method, body: string }).
// Por dentro usa el cliente único (apiFetch), que ya agrega el token y refresca la sesión.
export const peticionAuth = <T>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: string } = {}
): Promise<T> =>
  apiFetch<T>(path, {
    method: options.method,
    body: options.body ? JSON.parse(options.body) : undefined,
  });