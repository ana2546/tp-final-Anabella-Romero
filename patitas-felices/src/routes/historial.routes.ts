import { Router } from "express";
import {
  crearHistorialClinico,
  obtenerHistorialesPorMascota,
  obtenerHistorialClinicoPorId,
  actualizarHistorialClinico,
  eliminarHistorialClinico
} from "../controllers/historial.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Ver historiales: admin y user
router.get("/mascota/:idMascota", authenticate, obtenerHistorialesPorMascota);
router.get("/:id", authenticate, obtenerHistorialClinicoPorId);

// Crear historial: admin y user
router.post("/", authenticate, authorize(["admin", "user"]), crearHistorialClinico);

// Editar historial: solo user
router.put("/:id", authenticate, authorize(["user"]), actualizarHistorialClinico);

// Eliminar historial: solo admin
router.delete("/:id", authenticate, authorize(["admin"]), eliminarHistorialClinico);

export default router;