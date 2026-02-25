import { Router } from "express";
import {
  crearMascota,
  obtenerMascotas,
  actualizarMascota,
  eliminarMascota
} from "../controllers/mascotas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", crearMascota);
router.get("/", obtenerMascotas);
router.put("/:id", actualizarMascota);
router.delete("/:id", eliminarMascota);

export default router;
