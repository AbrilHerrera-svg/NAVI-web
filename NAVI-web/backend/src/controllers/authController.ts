import type { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { buscarUsuarioPorUid, crearUsuarioConUid, actualizarUsuario } from "../models/userModel";

// rol de firestore -> rol que usa el front
const roles: Record<string, string> = {
  admin: "Dueño",
  cajero: "Cajero",
  barista: "Barista",
  cocina: "Cocina",
  cliente: "Cliente",
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

// Firebase manda el correo con el enlace. La respuesta es igual exista o no la
// cuenta, para no revelar qué correos están registrados.
export const recuperarContrasena = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_API_KEY}`;

    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Firebase-Locale": "es" },
      body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
    });

    if (!respuesta.ok) {
      const datos = await respuesta.json();
      const motivo = String(datos.error?.message || "");
      console.log("Error de firebase al recuperar contraseña:", motivo);
      if (!motivo.includes("EMAIL_NOT_FOUND")) {
        res.status(502).json({ mensaje: "No se pudo enviar el correo, intenta más tarde" });
        return;
      }
    }

    res.json({ mensaje: "Si el correo está registrado, recibirás un enlace para cambiar tu contraseña" });
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

// Crea el perfil en Firestore para una cuenta de cliente que la app móvil ya
// registró directamente en Firebase Auth. Requiere un idToken válido (verificarToken).
export const registerCliente = async (req: Request, res: Response) => {
  const uid = req.uid as string;
  const { name, phone } = req.body;

  try {
    const existente = await buscarUsuarioPorUid(uid);
    if (existente) {
      res.status(409).json({ mensaje: "Ya tienes un perfil registrado" });
      return;
    }

    const cuenta = await getAuth().getUser(uid);

    const datos = {
      name,
      email: cuenta.email ?? "",
      phone: phone ?? "",
      role: "cliente",
      status: "Activo",
    };

    await crearUsuarioConUid(uid, datos);

    res.status(201).json({
      perfil: {
        name: datos.name,
        email: datos.email,
        phone: datos.phone,
        role: roles[datos.role] ?? datos.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Perfil del usuario autenticado; la app móvil lo pide tras iniciar sesión
// directamente con Firebase Auth, para saber su nombre/rol/estado.
export const me = async (req: Request, res: Response) => {
  const uid = req.uid as string;

  try {
    const usuario = await buscarUsuarioPorUid(uid);

    if (!usuario) {
      res.status(404).json({ mensaje: "Tu cuenta no tiene perfil en el sistema" });
      return;
    }

    if (usuario.status === "Inactivo") {
      res.status(403).json({ mensaje: "Tu cuenta está desactivada" });
      return;
    }

    res.json({
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

// Edita el propio perfil (nombre/teléfono); solo sobre el uid del token, no
// sobre un id que mande el cliente, así nadie edita el perfil de alguien más.
export const actualizarMiPerfil = async (req: Request, res: Response) => {
  const uid = req.uid as string;

  try {
    const usuario = await buscarUsuarioPorUid(uid);
    if (!usuario) {
      res.status(404).json({ mensaje: "Tu cuenta no tiene perfil en el sistema" });
      return;
    }

    await actualizarUsuario(uid, req.body);
    const actualizado = { ...usuario, ...req.body };

    res.json({
      perfil: {
        name: actualizado.name,
        email: actualizado.email,
        phone: actualizado.phone,
        role: roles[actualizado.role] ?? actualizado.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Guarda el token de notificaciones push del dispositivo; solo sobre la
// propia cuenta. Se vuelve a llamar cada vez que Firebase lo renueva.
export const actualizarFcmToken = async (req: Request, res: Response) => {
  const uid = req.uid as string;

  try {
    await actualizarUsuario(uid, { fcmToken: req.body.token });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};