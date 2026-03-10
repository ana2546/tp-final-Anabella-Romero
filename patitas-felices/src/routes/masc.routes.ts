import { Router } from "express";
import {
  getAllMasc,
  searchAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getMascById
} from "../controllers/masc.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/search", authenticate, searchAnimals);
router.get("/:id", authenticate, getMascById);
router.get("/", authenticate, getAllMasc);
router.post("/", authenticate, createAnimal);
router.put("/:id", authenticate, updateAnimal);
router.delete("/:id", authenticate, deleteAnimal);

export default router;