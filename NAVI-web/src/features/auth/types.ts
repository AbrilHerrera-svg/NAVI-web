import type { ProfileInfo } from "../profile/types";

// Lo que responde POST /api/auth/login
export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number; // segundos de vida del token
  perfil: ProfileInfo;
}

// Lo que responde POST /api/auth/refresh
export interface RefreshResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Lo que guardamos en el navegador para no pedir login al recargar
export interface StoredSession {
  token: string;
  refreshToken: string;
  expiraEn: number; // momento exacto en que vence el token (ms)
  perfil: ProfileInfo;
}
