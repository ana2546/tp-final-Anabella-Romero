import {
  crearDueno,
  obtenerDuenos,
  obtenerDuenoPorId,
  actualizarDueno,
  eliminarDueno,
  DatosDueno
} from "../models/dueno.model";

export const crearDuenoServicio = async (datos: DatosDueno) => {

  return await crearDueno(datos);

};

export const obtenerDuenosServicio = async () => {

  return await obtenerDuenos();

};

export const obtenerDuenoPorIdServicio = async (id: number) => {

  return await obtenerDuenoPorId(id);

};

export const actualizarDuenoServicio = async (id: number, datos: DatosDueno) => {

  return await actualizarDueno(id, datos);

};

export const eliminarDuenoServicio = async (id: number) => {

  return await eliminarDueno(id);

};