import { Request, Response } from "express";
import {
  crearDuenoServicio,
  obtenerDuenosServicio,
  obtenerDuenoPorIdServicio,
  actualizarDuenoServicio,
  eliminarDuenoServicio
} from "../services/dueno.service";

export const crearDueno = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, telefono, direccion } = req.body;

    if (!nombre || !apellido || !telefono) {
      return res.status(400).json({
        mensaje: "Nombre, apellido y teléfono son obligatorios"
      });
    }

    const nuevoDueno = await crearDuenoServicio({
      nombre,
      apellido,
      telefono,
      direccion
    });

    res.status(201).json(nuevoDueno);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error creando dueño"
    });
  }
};

export const obtenerDuenos = async (_req: Request, res: Response) => {
  try {
    const duenos = await obtenerDuenosServicio();
    res.json(duenos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo dueños"
    });
  }
};

export const obtenerDuenoPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const dueno = await obtenerDuenoPorIdServicio(id);

    if (!dueno) {
      return res.status(404).json({
        mensaje: "Dueño no encontrado"
      });
    }

    res.json(dueno);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo dueño"
    });
  }
};

export const actualizarDueno = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, telefono, direccion } = req.body;

    if (!nombre || !apellido || !telefono) {
      return res.status(400).json({
        mensaje: "Nombre, apellido y teléfono son obligatorios"
      });
    }

    const duenoExistente = await obtenerDuenoPorIdServicio(id);

    if (!duenoExistente) {
      return res.status(404).json({
        mensaje: "Dueño no encontrado"
      });
    }

    const duenoActualizado = await actualizarDuenoServicio(id, {
      nombre,
      apellido,
      telefono,
      direccion
    });

    res.json(duenoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error actualizando dueño"
    });
  }
};

export const eliminarDueno = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const duenoExistente = await obtenerDuenoPorIdServicio(id);

    if (!duenoExistente) {
      return res.status(404).json({
        mensaje: "Dueño no encontrado"
      });
    }

    await eliminarDuenoServicio(id);

    res.json({
      mensaje: "Dueño eliminado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error eliminando dueño"
    });
  }
};