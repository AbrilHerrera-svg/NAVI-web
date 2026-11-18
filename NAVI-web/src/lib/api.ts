export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Error con el código HTTP para poder distinguir 401, 403, 429, etc.
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Hace la petición al backend y devuelve el JSON.
// Si algo falla lanza un ApiError con un mensaje listo para mostrar al usuario.
export const peticion = async <T>(ruta: string, opciones: RequestInit = {}): Promise<T> => {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: { "Content-Type": "application/json", ...opciones.headers },
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor");
  }

  // el limitador de intentos del backend responde texto plano, por eso el catch
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    if (respuesta.status === 429) {
      throw new ApiError(429, datos?.mensaje ?? "Demasiados intentos, intenta más tarde");
    }
    throw new ApiError(respuesta.status, datos?.mensaje ?? "Ocurrió un error, intenta de nuevo");
  }

  return datos as T;
};
