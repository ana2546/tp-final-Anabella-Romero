import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 3 })
    .withMessage("El nombre de usuario debe tener al menos 3 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una mayúscula")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("La contraseña debe contener al menos un carácter especial"),

  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del veterinario es obligatorio"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido del veterinario es obligatorio"),

  body("matricula")
    .trim()
    .notEmpty()
    .withMessage("La matrícula es obligatoria"),

  body("especialidad")
    .trim()
    .notEmpty()
    .withMessage("La especialidad es obligatoria"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];