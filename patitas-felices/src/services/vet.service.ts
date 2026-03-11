import {
  crearVeterinario,
  obtenerVeterinarios,
  obtenerVeterinarioPorId,
  actualizarVeterinario,
  eliminarVeterinario,
  DatosVeterinario
} from "../models/vet.model";

export const crearVeterinarioServicio = async (datos: DatosVeterinario) => {
  return await crearVeterinario(datos);
};

export const obtenerVeterinariosServicio = async () => {
  return await obtenerVeterinarios();
};

export const obtenerVeterinarioPorIdServicio = async (id: number) => {
  return await obtenerVeterinarioPorId(id);
};

export const actualizarVeterinarioServicio = async (
  id: number,
  datos: DatosVeterinario
) => {
  return await actualizarVeterinario(id, datos);
};

export const eliminarVeterinarioServicio = async (id: number) => {
  return await eliminarVeterinario(id);
};