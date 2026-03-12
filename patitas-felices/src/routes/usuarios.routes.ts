import { Router } from "express";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
} from "../controllers/usuarios.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, authorize(["admin"]), obtenerUsuarios);
router.get("/:id", authenticate, authorize(["admin"]), obtenerUsuarioPorId);
router.put("/:id", authenticate, authorize(["admin"]), actualizarUsuario);
router.delete("/:id", authenticate, authorize(["admin"]), eliminarUsuario);

export default router;