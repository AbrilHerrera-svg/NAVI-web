import { Router } from "express";
import { getSesion, postAbrir, postCerrar } from "../controllers/cashRegisterController";
import { validateBody, validateIdParam } from "../middleware/validate";
import { abrirSesionSchema, cerrarSesionSchema } from "../schemas/cashRegisterSchemas";

const router = Router();

router.get("/", getSesion);
router.post("/open", validateBody(abrirSesionSchema), postAbrir);
router.post("/:id/close", validateIdParam("id"), validateBody(cerrarSesionSchema), postCerrar);

export default router;
