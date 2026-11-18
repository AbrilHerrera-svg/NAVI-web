import { peticionAuth } from "../../auth";
import type { UserRecord } from "../types";

// GET /api/users
export const obtenerUsuarios = () => peticionAuth<UserRecord[]>("/users");
