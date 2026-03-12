import pool from "../database/mysql";

export interface DatosVeterinario {
  nombre: string;
  apellido: string;
  matricula: string;
  especialidad: string;
  id_usuario?: number | null;
}

export const crearVeterinario = async (datos: DatosVeterinario) => {
  const [resultado]: any = await pool.query(
    `
    INSERT INTO veterinarios (nombre, apellido, matricula, especialidad, id_usuario)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      datos.nombre,
      datos.apellido,
      datos.matricula,
      datos.especialidad,
      datos.id_usuario ?? null
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
      especialidad,
      id_usuario
    FROM veterinarios
    ORDER BY nombre ASC
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
      especialidad,
      id_usuario
    FROM veterinarios
    WHERE id = ?
    `,
    [id]
  );

  return filas[0];
};

export const actualizarVeterinario = async (
  id: number,
  datos: DatosVeterinario
) => {
  await pool.query(
    `
    UPDATE veterinarios
    SET nombre = ?, apellido = ?, matricula = ?, especialidad = ?, id_usuario = ?
    WHERE id = ?
    `,
    [
      datos.nombre,
      datos.apellido,
      datos.matricula,
      datos.especialidad,
      datos.id_usuario ?? null,
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