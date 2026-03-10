import {
  findAllMasc,
  searchMasc,
  createMasc,
  updateMasc,
  deleteMasc,
  findMascById
} from "../models/masc.model";

export const getMasc = async () => {
  return await findAllMasc();
};

export const searchMascService = async (q: string) => {
  return await searchMasc(q);
};

export const createMascService = async (
  nombre: string,
  especie: string,
  fecha: string,
  dueno: number
) => {
  return await createMasc(nombre, especie, fecha, dueno);
};

export const updateMascService = async (
  id: number,
  nombre: string,
  especie: string,
  fecha: string
) => {
  return await updateMasc(id, nombre, especie, fecha);
};

export const deleteMascService = async (id: number) => {
  return await deleteMasc(id);
};

export const getMascByIdService = async (id: number) => {
  return await findMascById(id);
};