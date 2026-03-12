import { Request, Response } from "express";
import {
  obtenerUsuariosServicio,
  obtenerUsuarioPorIdServicio,
  actualizarUsuarioServicio,
  eliminarUsuarioServicio
} from "../services/usuarios.service";

export const obtenerUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await obtenerUsuariosServicio();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo usuarios"
    });
  }
};

export const obtenerUsuarioPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const usuario = await obtenerUsuarioPorIdServicio(id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo usuario"
    });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        mensaje: "El nombre de usuario y el email son obligatorios"
      });
    }

    const usuarioExistente = await obtenerUsuarioPorIdServicio(id);

    if (!usuarioExistente) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const usuarioActualizado = await actualizarUsuarioServicio(
      id,
      username,
      email
    );

    res.json(usuarioActualizado);
  } catch (error: any) {
    console.error(error);

    if (
      error.code === "EMAIL_DUPLICADO" ||
      error.code === "USERNAME_DUPLICADO"
    ) {
      return res.status(409).json({
        mensaje: error.message
      });
    }

    res.status(500).json({
      mensaje: "Error actualizando usuario"
    });
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const usuarioLogueado = (req as any).user;

    if (usuarioLogueado && Number(usuarioLogueado.id) === id) {
      return res.status(403).json({
        mensaje: "No podés eliminar tu propio usuario"
      });
    }

    const usuarioExistente = await obtenerUsuarioPorIdServicio(id);

    if (!usuarioExistente) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    await eliminarUsuarioServicio(id);

    res.json({
      mensaje: "Usuario eliminado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error eliminando usuario"
    });
  }
};