import { ApiError, peticion } from "../../../lib/api";
import type { ProfileInfo } from "../../profile/types";
import type { LoginResponse, RefreshResponse, StoredSession } from "../types";

const CLAVE_SESION = "navi_sesion";

// Margen de 1 minuto para renovar el token antes de que venza
const MARGEN_MS = 60 * 1000;

const guardarSesion = (sesion: StoredSession) => {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
};

// Devuelve la sesión guardada o null si no hay (o si está dañada)
export const obtenerSesion = (): StoredSession | null => {
  try {
    const texto = localStorage.getItem(CLAVE_SESION);
    return texto ? (JSON.parse(texto) as StoredSession) : null;
  } catch {
    return null;
  }
};

export const cerrarSesion = () => {
  localStorage.removeItem(CLAVE_SESION);
};

export const iniciarSesion = async (email: string, password: string): Promise<ProfileInfo> => {
  const datos = await peticion<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });

  guardarSesion({
    token: datos.token,
    refreshToken: datos.refreshToken,
    expiraEn: Date.now() + datos.expiresIn * 1000,
    perfil: datos.perfil,
  });

  return datos.perfil;
};

// Devuelve un token válido para mandar en "Authorization: Bearer".
// Si ya venció (dura 1 hora), pide uno nuevo con el refreshToken.
// Lo usarán los services de los demás módulos (users, orders, etc.).
export const obtenerToken = async (): Promise<string> => {
  const sesion = obtenerSesion();

  if (!sesion) {
    throw new Error("No hay sesión iniciada");
  }

  if (Date.now() < sesion.expiraEn - MARGEN_MS) {
    return sesion.token;
  }

  try {
    const datos = await peticion<RefreshResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: sesion.refreshToken }),
    });

    guardarSesion({
      ...sesion,
      token: datos.token,
      refreshToken: datos.refreshToken,
      expiraEn: Date.now() + datos.expiresIn * 1000,
    });

    return datos.token;
  } catch (error) {
    // no se pudo renovar: la sesión ya no sirve
    cerrarSesion();
    throw error;
  }
};

// Igual que peticion, pero manda el token de la sesión en "Authorization: Bearer".
// Si el backend responde 401 (token inválido), cierra la sesión y recarga para volver al login.
// Es la que usan los services de todos los módulos.
export const peticionAuth = async <T>(ruta: string, opciones: RequestInit = {}): Promise<T> => {
  const token = await obtenerToken();

  try {
    return await peticion<T>(ruta, {
      ...opciones,
      headers: { ...opciones.headers, Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      cerrarSesion();
      window.location.reload();
    }
    throw error;
  }
};
