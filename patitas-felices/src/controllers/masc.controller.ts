import { Request, Response } from "express";
import {
  getMasc,
  searchMascService,
  createMascService,
  updateMascService,
  deleteMascService,
  getMascByIdService
} from "../services/masc.service";

export const getAllMasc = async (req: Request, res: Response) => {
  try {
    const masc = await getMasc();

    const normalizedMasc = (masc as any[]).map((item) => ({
      id: item.id,
      name: item.mascota,
      owner: `${item.dueno_nombre ?? ""} ${item.dueno_apellido ?? ""}`.trim() || "Sin dueño",
      vet: `${item.vet_nombre ?? ""} ${item.vet_apellido ?? ""}`.trim() || "Sin veterinario",
      history: item.descripcion || "Sin historial",
    }));

    res.json(normalizedMasc);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo mascotas" });
  }
};

export const searchAnimals = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string)?.trim();

    if (!q) {
      const masc = await getMasc();

      const normalizedMasc = (masc as any[]).map((item) => ({
        id: item.id,
        name: item.mascota,
        owner: `${item.dueno_nombre ?? ""} ${item.dueno_apellido ?? ""}`.trim() || "Sin dueño",
        vet: `${item.vet_nombre ?? ""} ${item.vet_apellido ?? ""}`.trim() || "Sin veterinario",
        history: item.descripcion || "Sin historial",
      }));

      return res.json(normalizedMasc);
    }

    const animals = await searchMascService(q);

    const normalized = (animals as any[]).map((item) => ({
      id: item.id,
      name: item.mascota,
      owner: `${item.dueno_nombre ?? ""} ${item.dueno_apellido ?? ""}`.trim() || "Sin dueño",
      vet: `${item.vet_nombre ?? ""} ${item.vet_apellido ?? ""}`.trim() || "Sin veterinario",
      history: item.descripcion || "Sin historial",
    }));

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Error buscando mascotas" });
  }
};

export const createAnimal = async (req: Request, res: Response) => {
  try {
    const { nombre, especie, fecha, dueno } = req.body;

    await createMascService(nombre, especie, fecha, dueno);

    res.json({ message: "Mascota creada" });
  } catch (error) {
    res.status(500).json({ message: "Error creando mascota" });
  }
};

export const updateAnimal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nombre, especie, fecha } = req.body;

    await updateMascService(id, nombre, especie, fecha);

    res.json({ message: "Mascota actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando mascota" });
  }
};

export const deleteAnimal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await deleteMascService(id);

    res.json({ message: "Mascota eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando mascota" });
  }
};

export const getMascById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pet = await getMascByIdService(Number(id));
    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mascota" });
  }
};