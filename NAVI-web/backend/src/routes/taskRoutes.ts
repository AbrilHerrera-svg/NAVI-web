import { Router } from "express";
import { getTareas, postTarea, putTarea, deleteTarea } from "../controllers/taskController";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearTareaSchema, actualizarTareaSchema } from "../schemas/taskSchemas";

const router = Router();

router.get("/", getTareas);
router.post("/", validateBody(crearTareaSchema), postTarea);
router.put("/:id", validateIdParam("id"), validateBody(actualizarTareaSchema), putTarea);
router.delete("/:id", validateIdParam("id"), deleteTarea);

export default router;
