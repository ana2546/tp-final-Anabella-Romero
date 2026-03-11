import pool from "../database/mysql";

export interface DatosDueno {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion?: string;
}

export const crearDueno = async (datos: DatosDueno) => {

  const [resultado]: any = await pool.query(
    `
    INSERT INTO duenos (nombre, apellido, telefono, direccion)
    VALUES (?, ?, ?, ?)
    `,
    [
      datos.nombre,
      datos.apellido,
      datos.telefono,
      datos.direccion || null
    ]
  );

  return {
    id: resultado.insertId,
    ...datos
  };

};

export const obtenerDuenos = async () => {

  const [filas] = await pool.query(
    `
    SELECT
      id,
      nombre,
      apellido,
      telefono,
      direccion
    FROM duenos
    ORDER BY id ASC
    `
  );

  return filas;

};

export const obtenerDuenoPorId = async (id: number) => {

  const [filas]: any = await pool.query(
    `
    SELECT
      id,
      nombre,
      apellido,
      telefono,
      direccion
    FROM duenos
    WHERE id = ?
    `,
    [id]
  );

  return filas[0];

};

export const actualizarDueno = async (id: number, datos: DatosDueno) => {

  await pool.query(
    `
    UPDATE duenos
    SET nombre = ?, apellido = ?, telefono = ?, direccion = ?
    WHERE id = ?
    `,
    [
      datos.nombre,
      datos.apellido,
      datos.telefono,
      datos.direccion || null,
      id
    ]
  );

  return {
    id,
    ...datos
  };

};

export const eliminarDueno = async (id: number) => {

  await pool.query(
    `
    DELETE FROM duenos
    WHERE id = ?
    `,
    [id]
  );

};