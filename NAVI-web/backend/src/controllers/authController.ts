import type { Request, Response } from "express";
import { buscarUsuarioPorUid } from "../models/userModel";

// rol de firestore -> rol que usa el front
const roles: Record<string, string> = {
  admin: "Dueño",
  encargado: "Encargado",
  cajero: "Cajero",
  barista: "Barista",
  cocina: "Cocina",
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // validar que lleguen los datos
  if (!email || !password) {
    res.status(400).json({ mensaje: "Faltan correo o contraseña" });
    return;
  }

  try {
    // 1. validar correo y contraseña con firebase auth
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;

    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      const motivo = String(datos.error?.message || "");
      // ver el error real en la terminal del backend
      console.log("Error de firebase:", motivo);
      if (motivo.includes("TOO_MANY_ATTEMPTS")) {
        res.status(429).json({ mensaje: "Demasiados intentos, intenta más tarde" });
        return;
      }
      res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
      return;
    }

    // 2. buscar su perfil en firestore (localId es el uid)
    const usuario = await buscarUsuarioPorUid(datos.localId);

    if (!usuario) {
      res.status(404).json({ mensaje: "Tu cuenta no tiene perfil en el sistema" });
      return;
    }

    // 3. revisar que esté activo
    if (usuario.status === "Inactivo") {
      res.status(403).json({ mensaje: "Tu cuenta está desactivada" });
      return;
    }

    // 4. mandar el perfil con el formato del front
    res.json({
      token: datos.idToken,
      refreshToken: datos.refreshToken,
      expiresIn: Number(datos.expiresIn), // segundos de vida del token (Firebase: 3600)
      perfil: {
        name: usuario.name,
        email: usuario.email,
        phone: usuario.phone,
        role: roles[usuario.role] ?? usuario.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// El idToken dura 1 hora; el front debe pedir uno nuevo con el refreshToken
// (que no expira hasta que se revoque) en vez de forzar un login de nuevo.
export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`;

    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      console.log("Error al refrescar token:", datos.error?.message);
      res.status(401).json({ mensaje: "Sesión expirada, vuelve a iniciar sesión" });
      return;
    }

    res.json({
      token: datos.id_token,
      refreshToken: datos.refresh_token,
      expiresIn: Number(datos.expires_in),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};