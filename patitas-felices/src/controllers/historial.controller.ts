import { Request, Response } from "express";
import {
  crearHistorialClinicoServicio,
  obtenerHistorialesPorMascotaServicio,
  obtenerHistorialClinicoPorIdServicio,
  actualizarHistorialClinicoServicio,
  eliminarHistorialClinicoServicio
} from "../services/historial.service";

export const crearHistorialClinico = async (req: Request, res: Response) => {
  try {
    const { idMascota, idVeterinario, descripcion } = req.body;

    if (!idMascota || !descripcion) {
      return res.status(400).json({
        mensaje: "idMascota y descripcion son obligatorios"
      });
    }

    const nuevoHistorial = await crearHistorialClinicoServicio({
      idMascota: Number(idMascota),
      idVeterinario: idVeterinario ? Number(idVeterinario) : null,
      descripcion
    });

    res.status(201).json(nuevoHistorial);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error creando historial clínico"
    });
  }
};

export const obtenerHistorialesPorMascota = async (
  req: Request,
  res: Response
) => {
  try {
    const idMascota = Number(req.params.idMascota);

    const historiales = await obtenerHistorialesPorMascotaServicio(idMascota);

    res.json(historiales);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo historiales clínicos"
    });
  }
};

export const obtenerHistorialClinicoPorId = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const historial = await obtenerHistorialClinicoPorIdServicio(id);

    if (!historial) {
      return res.status(404).json({
        mensaje: "Historial clínico no encontrado"
      });
    }

    res.json(historial);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo historial clínico"
    });
  }
};

export const actualizarHistorialClinico = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { descripcion } = req.body;

    if (!descripcion) {
      return res.status(400).json({
        mensaje: "La descripcion es obligatoria"
      });
    }

    const historialExistente = await obtenerHistorialClinicoPorIdServicio(id);

    if (!historialExistente) {
      return res.status(404).json({
        mensaje: "Historial clínico no encontrado"
      });
    }

    const historialActualizado = await actualizarHistorialClinicoServicio(
      id,
      descripcion
    );

    res.json(historialActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error actualizando historial clínico"
    });
  }
};

export const eliminarHistorialClinico = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const historialExistente = await obtenerHistorialClinicoPorIdServicio(id);

    if (!historialExistente) {
      return res.status(404).json({
        mensaje: "Historial clínico no encontrado"
      });
    }

    await eliminarHistorialClinicoServicio(id);

    res.json({
      mensaje: "Historial clínico eliminado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error eliminando historial clínico"
    });
  }
};