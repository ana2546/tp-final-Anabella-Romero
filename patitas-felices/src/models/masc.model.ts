import pool from "../database/mysql";

export const findAllMasc = async () => {
  const [filas] = await pool.query(`
    SELECT 
      m.id,
      m.nombre AS mascota,
      m.especie,
      m.fecha_nacimiento,
      m.id_duenos,

      d.nombre AS dueno_nombre,
      d.apellido AS dueno_apellido,

      (
        SELECT v.nombre
        FROM historial_clinico h2
        LEFT JOIN veterinarios v ON h2.id_veterinario = v.id
        WHERE h2.id_mascota = m.id
        ORDER BY h2.fecha_registro DESC
        LIMIT 1
      ) AS vet_nombre,

      (
        SELECT v.apellido
        FROM historial_clinico h2
        LEFT JOIN veterinarios v ON h2.id_veterinario = v.id
        WHERE h2.id_mascota = m.id
        ORDER BY h2.fecha_registro DESC
        LIMIT 1
      ) AS vet_apellido,

      (
        SELECT h2.descripcion
        FROM historial_clinico h2
        WHERE h2.id_mascota = m.id
        ORDER BY h2.fecha_registro DESC
        LIMIT 1
      ) AS descripcion

    FROM mascotas m
    JOIN duenos d ON m.id_duenos = d.id
    ORDER BY m.id ASC
  `);

  return filas;
};

export const searchMasc = async (q: string) => {
  const [filas] = await pool.query(
    `
    SELECT 
      m.id,
      m.nombre AS mascota,
      m.especie,
      m.fecha_nacimiento,
      m.id_duenos,

      d.nombre AS dueno_nombre,
      d.apellido AS dueno_apellido,

      (
        SELECT v.nombre
        FROM historial_clinico h2
        LEFT JOIN veterinarios v ON h2.id_veterinario = v.id
        WHERE h2.id_mascota = m.id
        ORDER BY h2.fecha_registro DESC
        LIMIT 1
      ) AS vet_nombre,

      (
        SELECT v.apellido
        FROM historial_clinico h2
        LEFT JOIN veterinarios v ON h2.id_veterinario = v.id
        WHERE h2.id_mascota = m.id
        ORDER BY h2.fecha_registro DESC
        LIMIT 1
      ) AS vet_apellido,

      (
        SELECT h2.descripcion
        FROM historial_clinico h2
        WHERE h2.id_mascota = m.id
        ORDER BY h2.fecha_registro DESC
        LIMIT 1
      ) AS descripcion

    FROM mascotas m
    JOIN duenos d ON m.id_duenos = d.id
    WHERE m.nombre LIKE ?
       OR d.nombre LIKE ?
       OR d.apellido LIKE ?
    ORDER BY m.id ASC
    `,
    [`%${q}%`, `%${q}%`, `%${q}%`]
  );

  return filas;
};

export const createMasc = async (
  nombre: string,
  especie: string,
  fecha: string,
  dueno: number
) => {
  const [resultado]: any = await pool.query(
    `
    INSERT INTO mascotas (nombre, especie, fecha_nacimiento, id_duenos)
    VALUES (?, ?, ?, ?)
    `,
    [nombre, especie, fecha || null, dueno]
  );

  return {
    id: resultado.insertId,
    nombre,
    especie,
    fecha_nacimiento: fecha || null,
    id_duenos: dueno
  };
};

export const updateMasc = async (
  id: number,
  nombre: string,
  especie: string,
  fecha: string,
  dueno: number
) => {
  await pool.query(
    `
    UPDATE mascotas
    SET nombre = ?, especie = ?, fecha_nacimiento = ?, id_duenos = ?
    WHERE id = ?
    `,
    [nombre, especie, fecha || null, dueno, id]
  );

  return {
    id,
    nombre,
    especie,
    fecha_nacimiento: fecha || null,
    id_duenos: dueno
  };
};

export const deleteMasc = async (id: number) => {
  await pool.query(
    `
    DELETE FROM historial_clinico
    WHERE id_mascota = ?
    `,
    [id]
  );

  await pool.query(
    `
    DELETE FROM mascotas
    WHERE id = ?
    `,
    [id]
  );
};

export const findMascById = async (id: number) => {
  const [filas]: any = await pool.query(
    `
    SELECT
      m.id,
      m.nombre,
      m.especie,
      m.fecha_nacimiento,
      m.id_duenos
    FROM mascotas m
    WHERE m.id = ?
    `,
    [id]
  );

  return filas[0];
};