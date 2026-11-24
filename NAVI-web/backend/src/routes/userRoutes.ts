import { Router } from "express";
import { getUsuarios, postUsuario, putUsuario, deleteUsuario } from "../controllers/userController";
import { requireRole } from "../middleware/auth";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearUsuarioSchema, actualizarUsuarioSchema } from "../schemas/userSchemas";

const router = Router();

// Gestionar cuentas de personal es más sensible que el resto de staff: solo
// admin/encargado, no cualquier rol de staff.
router.use(requireRole("admin", "encargado"));

router.get("/", getUsuarios);
router.post("/", validateBody(crearUsuarioSchema), postUsuario);
router.put("/:id", validateIdParam("id"), validateBody(actualizarUsuarioSchema), putUsuario);
router.delete("/:id", validateIdParam("id"), deleteUsuario);

export default router;
