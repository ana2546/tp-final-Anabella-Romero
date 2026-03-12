import { Request, Response } from "express";
import {
  crearVeterinarioServicio,
  obtenerVeterinariosServicio,
  obtenerVeterinarioPorIdServicio,
  actualizarVeterinarioServicio,
  eliminarVeterinarioServicio
} from "../services/vet.service";

export const crearVeterinario = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, matricula, especialidad, id_usuario } = req.body;

    if (!nombre || !apellido || !matricula || !especialidad) {
      return res.status(400).json({
        mensaje: "Nombre, apellido, matrícula y especialidad son obligatorios"
      });
    }

    const nuevoVeterinario = await crearVeterinarioServicio({
      nombre,
      apellido,
      matricula,
      especialidad,
      id_usuario: id_usuario ?? null
    });

    res.status(201).json(nuevoVeterinario);
  } catch (error: any) {
    console.error(error);

    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        mensaje: "La matrícula o el usuario asociado ya existe"
      });
    }

    res.status(500).json({
      mensaje: "Error creando veterinario"
    });
  }
};

export const obtenerVeterinarios = async (_req: Request, res: Response) => {
  try {
    const veterinarios = await obtenerVeterinariosServicio();
    res.json(veterinarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo veterinarios"
    });
  }
};

export const obtenerVeterinarioPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const veterinario = await obtenerVeterinarioPorIdServicio(id);

    if (!veterinario) {
      return res.status(404).json({
        mensaje: "Veterinario no encontrado"
      });
    }

    res.json(veterinario);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo veterinario"
    });
  }
};

export const actualizarVeterinario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, matricula, especialidad, id_usuario } = req.body;

    if (!nombre || !apellido || !matricula || !especialidad) {
      return res.status(400).json({
        mensaje: "Nombre, apellido, matrícula y especialidad son obligatorios"
      });
    }

    const veterinarioExistente = await obtenerVeterinarioPorIdServicio(id);

    if (!veterinarioExistente) {
      return res.status(404).json({
        mensaje: "Veterinario no encontrado"
      });
    }

    const veterinarioActualizado = await actualizarVeterinarioServicio(id, {
      nombre,
      apellido,
      matricula,
      especialidad,
      id_usuario: id_usuario ?? null
    });

    res.json(veterinarioActualizado);
  } catch (error: any) {
    console.error(error);

    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        mensaje: "La matrícula o el usuario asociado ya existe"
      });
    }

    res.status(500).json({
      mensaje: "Error actualizando veterinario"
    });
  }
};

export const eliminarVeterinario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const veterinarioExistente = await obtenerVeterinarioPorIdServicio(id);

    if (!veterinarioExistente) {
      return res.status(404).json({
        mensaje: "Veterinario no encontrado"
      });
    }

    await eliminarVeterinarioServicio(id);

    res.json({
      mensaje: "Veterinario eliminado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error eliminando veterinario"
    });
  }
};