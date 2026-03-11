import { Router } from "express";
import {
  crearDueno,
  obtenerDuenos,
  obtenerDuenoPorId,
  actualizarDueno,
  eliminarDueno
} from "../controllers/dueno.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// ver dueño por id → admin y user
router.get("/:id", authenticate, obtenerDuenoPorId);

// ver lista de dueños → solo admin
router.get("/", authenticate, authorize(["admin"]), obtenerDuenos);

// crear dueño → solo admin
router.post("/", authenticate, authorize(["admin"]), crearDueno);

// actualizar dueño → solo admin
router.put("/:id", authenticate, authorize(["admin"]), actualizarDueno);

// eliminar dueño → solo admin
router.delete("/:id", authenticate, authorize(["admin"]), eliminarDueno);

export default router;