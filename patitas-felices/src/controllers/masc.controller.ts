import { Request, Response } from "express";
import {
  getMasc,
  searchMascService,
  createMascService,
  updateMascService,
  deleteMascService,
  getMascByIdService
} from "../services/masc.service";

export const getAllMasc = async (_req: Request, res: Response) => {
  try {
    const mascotas = await getMasc();

    const mascotasNormalizadas = (mascotas as any[]).map((item) => ({
      id: item.id,
      name: item.mascota,
      owner:
        `${item.dueno_nombre ?? ""} ${item.dueno_apellido ?? ""}`.trim() ||
        "Sin dueño",
      vet:
        `${item.vet_nombre ?? ""} ${item.vet_apellido ?? ""}`.trim() ||
        "Sin veterinario",
      history: item.descripcion || "Sin historial"
    }));

    res.json(mascotasNormalizadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo mascotas"
    });
  }
};

export const searchAnimals = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string)?.trim();

    if (!q) {
      const mascotas = await getMasc();

      const mascotasNormalizadas = (mascotas as any[]).map((item) => ({
        id: item.id,
        name: item.mascota,
        owner:
          `${item.dueno_nombre ?? ""} ${item.dueno_apellido ?? ""}`.trim() ||
          "Sin dueño",
        vet:
          `${item.vet_nombre ?? ""} ${item.vet_apellido ?? ""}`.trim() ||
          "Sin veterinario",
        history: item.descripcion || "Sin historial"
      }));

      return res.json(mascotasNormalizadas);
    }

    const mascotas = await searchMascService(q);

    const mascotasNormalizadas = (mascotas as any[]).map((item) => ({
      id: item.id,
      name: item.mascota,
      owner:
        `${item.dueno_nombre ?? ""} ${item.dueno_apellido ?? ""}`.trim() ||
        "Sin dueño",
      vet:
        `${item.vet_nombre ?? ""} ${item.vet_apellido ?? ""}`.trim() ||
        "Sin veterinario",
      history: item.descripcion || "Sin historial"
    }));

    res.json(mascotasNormalizadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error buscando mascotas"
    });
  }
};

export const getMascById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const mascota = await getMascByIdService(id);

    if (!mascota) {
      return res.status(404).json({
        mensaje: "Mascota no encontrada"
      });
    }

    res.json(mascota);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo mascota"
    });
  }
};

export const createAnimal = async (req: Request, res: Response) => {
  try {
    const { nombre, especie, fecha, dueno } = req.body;

    if (!nombre || !especie || !dueno) {
      return res.status(400).json({
        mensaje: "Nombre, especie y dueño son obligatorios"
      });
    }

    const mascota = await createMascService(
      nombre,
      especie,
      fecha,
      Number(dueno)
    );

    res.status(201).json(mascota);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error creando mascota"
    });
  }
};

export const updateAnimal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nombre, especie, fecha, dueno } = req.body;

    const mascotaExistente = await getMascByIdService(id);

    if (!mascotaExistente) {
      return res.status(404).json({
        mensaje: "Mascota no encontrada"
      });
    }

    const mascotaActualizada = await updateMascService(
      id,
      nombre,
      especie,
      fecha,
      Number(dueno)
    );

    res.json(mascotaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error actualizando mascota"
    });
  }
};

export const deleteAnimal = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const mascotaExistente = await getMascByIdService(id);

    if (!mascotaExistente) {
      return res.status(404).json({
        mensaje: "Mascota no encontrada"
      });
    }

    await deleteMascService(id);

    res.json({
      mensaje: "Mascota eliminada correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error eliminando mascota"
    });
  }
};