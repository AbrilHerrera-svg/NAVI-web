// Cliente HTTP único del front: agrega el token de Firebase a cada petición y,
// si el servidor responde 401 (el token dura 1 h), pide uno nuevo con el
// refreshToken y repite la petición una vez.
const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

interface Tokens {
  token: string;
  refreshToken: string;
}

// En memoria: se pierde al recargar la página (hay que volver a iniciar sesión).
let tokens: Tokens | null = null;

export const setTokens = (next: Tokens | null) => {
  tokens = next;
};

export const clearTokens = () => {
  tokens = null;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Error desconocido';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  // false en login/refresh: no llevan token ni reintentan con refresh
  auth?: boolean;
}

const send = (path: string, { method = 'GET', body, auth = true }: RequestOptions) =>
  fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && tokens ? { Authorization: `Bearer ${tokens.token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

// Si varias peticiones fallan a la vez, solo se hace un refresh
let refreshing: Promise<boolean> | null = null;

const refreshSession = (): Promise<boolean> => {
  if (!tokens) return Promise.resolve(false);

  if (!refreshing) {
    refreshing = send('/auth/refresh', { method: 'POST', body: { refreshToken: tokens.refreshToken }, auth: false })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        tokens = { token: data.token, refreshToken: data.refreshToken };
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }

  return refreshing;
};

export const apiFetch = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  let res: Response;

  try {
    res = await send(path, options);

    if (res.status === 401 && options.auth !== false && (await refreshSession())) {
      res = await send(path, options);
    }
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const mensaje = (data as { mensaje?: string } | null)?.mensaje;
    throw new ApiError(mensaje ?? 'Error en el servidor', res.status, data);
  }

  return data as T;
};