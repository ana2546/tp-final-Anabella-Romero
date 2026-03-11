import { Router } from "express";
import {
  getAllMasc,
  searchAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getMascById
} from "../controllers/masc.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/search", authenticate, searchAnimals);
router.get("/:id", authenticate, getMascById);
router.get("/", authenticate, getAllMasc);

router.post("/", authenticate, authorize(["admin"]), createAnimal);
router.put("/:id", authenticate, authorize(["admin"]), updateAnimal);
router.delete("/:id", authenticate, authorize(["admin"]), deleteAnimal);

export default router;