import pool from "../database/mysql";

export interface DatosVeterinario {
  nombre: string;
  apellido: string;
  matricula: string;
  especialidad: string;
}

export const crearVeterinario = async (datos: DatosVeterinario) => {

  const [resultado]: any = await pool.query(
    `
    INSERT INTO veterinarios (nombre, apellido, matricula, especialidad)
    VALUES (?, ?, ?, ?)
    `,
    [
      datos.nombre,
      datos.apellido,
      datos.matricula,
      datos.especialidad
    ]
  );

  return {
    id: resultado.insertId,
    ...datos
  };

};

export const obtenerVeterinarios = async () => {

  const [filas] = await pool.query(
    `
    SELECT
      id,
      nombre,
      apellido,
      matricula,
      especialidad
    FROM veterinarios
    ORDER BY id ASC
    `
  );

  return filas;

};

export const obtenerVeterinarioPorId = async (id: number) => {

  const [filas]: any = await pool.query(
    `
    SELECT
      id,
      nombre,
      apellido,
      matricula,
      especialidad
    FROM veterinarios
    WHERE id = ?
    `,
    [id]
  );

  return filas[0];

};

export const actualizarVeterinario = async (id: number, datos: DatosVeterinario) => {

  await pool.query(
    `
    UPDATE veterinarios
    SET nombre = ?, apellido = ?, matricula = ?, especialidad = ?
    WHERE id = ?
    `,
    [
      datos.nombre,
      datos.apellido,
      datos.matricula,
      datos.especialidad,
      id
    ]
  );

  return {
    id,
    ...datos
  };

};

export const eliminarVeterinario = async (id: number) => {

  await pool.query(
    `
    DELETE FROM veterinarios
    WHERE id = ?
    `,
    [id]
  );

};