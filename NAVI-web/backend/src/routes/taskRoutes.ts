import { Router } from "express";
import { getTareas, postTarea, putTarea, deleteTarea } from "../controllers/taskController";
import { ROLES_STAFF, requireRole } from "../middleware/auth";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearTareaSchema, actualizarTareaSchema } from "../schemas/taskSchemas";

const router = Router();

// Las tareas internas son de staff, no de clientes.
router.use(requireRole(...ROLES_STAFF));

router.get("/", getTareas);
router.post("/", validateBody(crearTareaSchema), postTarea);
router.put("/:id", validateIdParam("id"), validateBody(actualizarTareaSchema), putTarea);
router.delete("/:id", validateIdParam("id"), deleteTarea);

export default router;
