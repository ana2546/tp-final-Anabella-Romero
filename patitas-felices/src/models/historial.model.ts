import pool from "../database/mysql";

export interface DatosHistorialClinico {
  idMascota: number;
  idVeterinario: number | null;
  descripcion: string;
}

export const crearHistorialClinico = async (datos: DatosHistorialClinico) => {
  const [resultado]: any = await pool.query(
    `
    INSERT INTO historial_clinico (id_mascota, id_veterinario, descripcion)
    VALUES (?, ?, ?)
    `,
    [
      datos.idMascota,
      datos.idVeterinario,
      datos.descripcion
    ]
  );

  return {
    id: resultado.insertId,
    ...datos
  };
};

export const obtenerHistorialesPorMascota = async (idMascota: number) => {
  const [filas] = await pool.query(
    `
    SELECT
      h.id,
      h.id_mascota,
      h.id_veterinario,
      h.fecha_registro,
      h.descripcion,
      v.nombre AS veterinario_nombre,
      v.apellido AS veterinario_apellido,
      v.matricula,
      v.especialidad
    FROM historial_clinico h
    LEFT JOIN veterinarios v
      ON h.id_veterinario = v.id
    WHERE h.id_mascota = ?
    ORDER BY h.fecha_registro DESC, h.id DESC
    `,
    [idMascota]
  );

  return filas;
};

export const obtenerHistorialClinicoPorId = async (id: number) => {
  const [filas]: any = await pool.query(
    `
    SELECT
      h.id,
      h.id_mascota,
      h.id_veterinario,
      h.fecha_registro,
      h.descripcion,
      v.nombre AS veterinario_nombre,
      v.apellido AS veterinario_apellido,
      v.matricula,
      v.especialidad
    FROM historial_clinico h
    LEFT JOIN veterinarios v
      ON h.id_veterinario = v.id
    WHERE h.id = ?
    `,
    [id]
  );

  return filas[0];
};

export const actualizarHistorialClinico = async (
  id: number,
  descripcion: string
) => {
  await pool.query(
    `
    UPDATE historial_clinico
    SET descripcion = ?
    WHERE id = ?
    `,
    [descripcion, id]
  );

  return {
    id,
    descripcion
  };
};

export const eliminarHistorialClinico = async (id: number) => {
  await pool.query(
    `
    DELETE FROM historial_clinico
    WHERE id = ?
    `,
    [id]
  );
};