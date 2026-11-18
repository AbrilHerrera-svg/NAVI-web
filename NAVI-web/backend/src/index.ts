import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import menuRoutes from "./routes/menuRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import taskRoutes from "./routes/taskRoutes";
import cashRegisterRoutes from "./routes/cashRegisterRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import { verificarToken } from "./middleware/auth";

const app = express();
const PORT = process.env.PORT || 3000;

// cabeceras de seguridad (CSP, no-sniff, etc.)
app.use(helmet());

// permitir que el front (vite) haga peticiones; origen configurable en prod
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));

// limita el tamaño del body para evitar payloads gigantes (DoS)
app.use(express.json({ limit: "100kb" }));

// limita intentos por IP para frenar fuerza bruta / abuso
const limiteGeneral = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false });
app.use(limiteGeneral);

// rutas (login y refresh tienen su propio límite, más estricto, dentro de authRoutes)
app.use("/api/auth", authRoutes);

// todo lo demás requiere una sesión de Firebase Auth válida
app.use("/api/users", verificarToken, userRoutes);
app.use("/api/menu", verificarToken, menuRoutes);
app.use("/api/inventory", verificarToken, inventoryRoutes);
app.use("/api/orders", verificarToken, orderRoutes);
app.use("/api/tasks", verificarToken, taskRoutes);
app.use("/api/cash-register", verificarToken, cashRegisterRoutes);
app.use("/api/settings", verificarToken, settingsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});