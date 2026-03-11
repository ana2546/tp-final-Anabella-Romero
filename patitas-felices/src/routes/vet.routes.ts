import { Router } from "express";
import {
  crearVeterinario,
  obtenerVeterinarios,
  obtenerVeterinarioPorId,
  actualizarVeterinario,
  eliminarVeterinario
} from "../controllers/vet.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, obtenerVeterinarios);
router.get("/:id", authenticate, obtenerVeterinarioPorId);

router.post("/", authenticate, authorize(["admin"]), crearVeterinario);
router.put("/:id", authenticate, authorize(["admin"]), actualizarVeterinario);
router.delete("/:id", authenticate, authorize(["admin"]), eliminarVeterinario);

export default router;