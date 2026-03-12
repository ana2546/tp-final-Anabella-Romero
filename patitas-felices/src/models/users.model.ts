import pool from "../database/mysql";
import { RowDataPacket } from "mysql2";
import { UserRole } from "../types/auth";

export interface Usuario {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export type UsuarioFila = Usuario & RowDataPacket;

export const buscarUsuario = async (
  email: string = "",
  username: string = ""
): Promise<Usuario | null> => {
  const [filas] = await pool.query<UsuarioFila[]>(
    `
    SELECT
      u.*,
      r.name AS role
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.email = ? OR u.username = ?
    LIMIT 1
    `,
    [email, username]
  );

  return filas.length ? filas[0] : null;
};