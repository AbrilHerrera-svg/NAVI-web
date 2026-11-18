import { Router } from "express";
import { getUsuarios, postUsuario, putUsuario, deleteUsuario } from "../controllers/userController";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearUsuarioSchema, actualizarUsuarioSchema } from "../schemas/userSchemas";

const router = Router();

router.get("/", getUsuarios);
router.post("/", validateBody(crearUsuarioSchema), postUsuario);
router.put("/:id", validateIdParam("id"), validateBody(actualizarUsuarioSchema), putUsuario);
router.delete("/:id", validateIdParam("id"), deleteUsuario);

export default router;
