import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { validationResult } from "express-validator";

export const register = async (req: Request, res: Response) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const {
      username,
      email,
      password,
      nombre,
      apellido,
      matricula,
      especialidad
    } = req.body;

    await authService.register(
      username,
      email,
      password,
      nombre,
      apellido,
      matricula,
      especialidad
    );

    return res.status(201).json({
      mensaje: "Usuario veterinario creado exitosamente"
    });
  } catch (error: any) {
    console.error(error);

    if (
      error.code === "EMAIL_DUPLICADO" ||
      error.code === "USERNAME_DUPLICADO" ||
      error.code === "MATRICULA_DUPLICADA"
    ) {
      return res.status(409).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: "Error al registrar el usuario veterinario"
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;
    const token = await authService.login(email, password);

    return res.json({ token });
  } catch (error: any) {
    if (error.message === "Credenciales inválidas") {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({
      error: "Error al iniciar sesión"
    });
  }
};