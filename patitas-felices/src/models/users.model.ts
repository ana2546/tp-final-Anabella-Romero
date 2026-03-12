import pool from "../database/mysql";
import { RowDataPacket } from "mysql2";
import { UserRole } from "../types/auth";

export interface Usuario {
  id: number;
  username: string;
  email: string;
  password: string;
  role?: UserRole | string;
}

export type UsuarioFila = Usuario & RowDataPacket;

export const buscarUsuario = async (
  email: string = "",
  username: string = ""
): Promise<Usuario | null> => {
  let sql = `
    SELECT
      u.id,
      u.username,
      u.email,
      u.password,
      r.name AS role
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
  `;

  let parametros: any[] = [];

  if (email && username) {
    sql += ` WHERE u.email = ? OR u.username = ? LIMIT 1 `;
    parametros = [email, username];
  } else if (email) {
    sql += ` WHERE u.email = ? LIMIT 1 `;
    parametros = [email];
  } else if (username) {
    sql += ` WHERE u.username = ? LIMIT 1 `;
    parametros = [username];
  } else {
    return null;
  }

  const [filas] = await pool.query<UsuarioFila[]>(sql, parametros);
  return filas.length ? filas[0] : null;
};

export const obtenerUsuarios = async () => {
  const [filas] = await pool.query(
    `
    SELECT
      u.id,
      u.username,
      u.email,
      r.name AS role
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    ORDER BY u.id ASC
    `
  );

  return filas;
};

export const obtenerUsuarioPorId = async (id: number) => {
  const [filas]: any = await pool.query(
    `
    SELECT
      u.id,
      u.username,
      u.email,
      r.name AS role
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = ?
    LIMIT 1
    `,
    [id]
  );

  return filas[0];
};

export const actualizarUsuario = async (
  id: number,
  username: string,
  email: string
) => {
  await pool.query(
    `
    UPDATE users
    SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [username, email, id]
  );

  return {
    id,
    username,
    email
  };
};

export const eliminarUsuario = async (id: number) => {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    await conexion.query(
      `
      UPDATE veterinarios
      SET id_usuario = NULL
      WHERE id_usuario = ?
      `,
      [id]
    );

    await conexion.query(
      `
      DELETE FROM user_roles
      WHERE user_id = ?
      `,
      [id]
    );

    await conexion.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [id]
    );

    await conexion.commit();
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
};