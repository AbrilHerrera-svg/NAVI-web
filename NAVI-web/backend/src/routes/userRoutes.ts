import { Router } from "express";
import { getUsuarios, postUsuario, putUsuario, deleteUsuario } from "../controllers/userController";

const router = Router();

router.get("/", getUsuarios);
router.post("/", postUsuario);
router.put("/:id", putUsuario);
router.delete("/:id", deleteUsuario);

export default router;
