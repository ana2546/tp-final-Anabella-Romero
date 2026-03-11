import {
  crearHistorialClinico,
  obtenerHistorialesPorMascota,
  obtenerHistorialClinicoPorId,
  actualizarHistorialClinico,
  eliminarHistorialClinico,
  DatosHistorialClinico
} from "../models/historial.model";

export const crearHistorialClinicoServicio = async (
  datos: DatosHistorialClinico
) => {
  return await crearHistorialClinico(datos);
};

export const obtenerHistorialesPorMascotaServicio = async (
  idMascota: number
) => {
  return await obtenerHistorialesPorMascota(idMascota);
};

export const obtenerHistorialClinicoPorIdServicio = async (id: number) => {
  return await obtenerHistorialClinicoPorId(id);
};

export const actualizarHistorialClinicoServicio = async (
  id: number,
  descripcion: string
) => {
  return await actualizarHistorialClinico(id, descripcion);
};

export const eliminarHistorialClinicoServicio = async (id: number) => {
  return await eliminarHistorialClinico(id);
};