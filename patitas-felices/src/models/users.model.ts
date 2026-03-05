import pool from '../database/mysql';
import { RowDataPacket } from 'mysql2';
import { UserRole } from '../types/auth';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export type UserRow = User & RowDataPacket;

export const findUser = async (
  email: string = '',
  username: string = ''
): Promise<User | null> => {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT u.*, r.name as role FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id WHERE u.email = ? OR u.username = ? LIMIT 1',
    [email, username]
  );

  return rows.length ? rows[0] : null;
};

export const createUser = async (
  user: Omit<User, 'id' | 'role'>
): Promise<number> => {
  const [userResult] = await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [user.username, user.email, user.password]
  );

  console.log('User result:', userResult);

  return (userResult as any).insertId;
};