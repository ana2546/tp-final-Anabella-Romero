import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import pool from "../database/mysql";
import * as userModel from "../models/users.model";
import { JwtPayload, UserRole } from "../types/auth";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}

const secretKey: string = process.env.JWT_SECRET;

export const register = async (
  username: string,
  email: string,
  password: string,
  nombre: string,
  apellido: string,
  matricula: string,
  especialidad: string
): Promise<number> => {
  const usuarioExistentePorEmail = await userModel.buscarUsuario(email, "");
  if (usuarioExistentePorEmail) {
    const error: any = new Error("El email ya existe");
    error.code = "EMAIL_DUPLICADO";
    throw error;
  }

  const usuarioExistentePorUsername = await userModel.buscarUsuario("", username);
  if (usuarioExistentePorUsername) {
    const error: any = new Error("El nombre de usuario ya existe");
    error.code = "USERNAME_DUPLICADO";
    throw error;
  }

  const [filasVeterinario]: any = await pool.query(
    `
    SELECT id
    FROM veterinarios
    WHERE matricula = ?
    LIMIT 1
    `,
    [matricula]
  );

  if (filasVeterinario.length > 0) {
    const error: any = new Error("La matrícula ya existe");
    error.code = "MATRICULA_DUPLICADA";
    throw error;
  }

  const passwordHasheada = await bcrypt.hash(password, 10);
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [resultadoUsuario]: any = await conexion.query(
      `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
      `,
      [username, email, passwordHasheada]
    );

    const idUsuario = resultadoUsuario.insertId;

    // IMPORTANTE:
    // NO insertamos en user_roles desde el backend
    // porque el trigger assign_user_role lo hace automáticamente.

    await conexion.query(
      `
      INSERT INTO veterinarios (nombre, apellido, matricula, especialidad, id_usuario)
      VALUES (?, ?, ?, ?, ?)
      `,
      [nombre, apellido, matricula, especialidad, idUsuario]
    );

    await conexion.commit();

    return idUsuario;
  } catch (error: any) {
    await conexion.rollback();

    if (error?.code === "ER_DUP_ENTRY") {
      if (error?.sqlMessage?.includes("username")) {
        error.code = "USERNAME_DUPLICADO";
        error.message = "El nombre de usuario ya existe";
      } else if (error?.sqlMessage?.includes("email")) {
        error.code = "EMAIL_DUPLICADO";
        error.message = "El email ya existe";
      } else if (error?.sqlMessage?.includes("matricula")) {
        error.code = "MATRICULA_DUPLICADA";
        error.message = "La matrícula ya existe";
      }
    }

    throw error;
  } finally {
    conexion.release();
  }
};

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const errorCredenciales = new Error("Credenciales inválidas");

  const usuario = await userModel.buscarUsuario(email);
  if (!usuario) throw errorCredenciales;

  const esValido = await bcrypt.compare(password, usuario.password);
  if (!esValido) throw errorCredenciales;

  const payload: JwtPayload = {
    id: usuario.id,
    username: usuario.username,
    role: usuario.role as UserRole,
  };

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "1h",
    issuer: "curso-utn-backend",
  };

  return jwt.sign(payload, secretKey, options);
};