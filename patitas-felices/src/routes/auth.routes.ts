import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/register",
  authenticate,
  authorize(["admin"]),
  registerValidator,
  register
);

router.post("/login", loginValidator, login);

export default router;