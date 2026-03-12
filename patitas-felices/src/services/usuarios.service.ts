import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  buscarUsuario
} from "../models/users.model";

export const obtenerUsuariosServicio = async () => {
  return await obtenerUsuarios();
};

export const obtenerUsuarioPorIdServicio = async (id: number) => {
  return await obtenerUsuarioPorId(id);
};

export const actualizarUsuarioServicio = async (
  id: number,
  username: string,
  email: string
) => {
  const usuarioPorEmail = await buscarUsuario(email, "");
  if (usuarioPorEmail && Number(usuarioPorEmail.id) !== Number(id)) {
    const error: any = new Error("El email ya existe");
    error.code = "EMAIL_DUPLICADO";
    throw error;
  }

  const usuarioPorUsername = await buscarUsuario("", username);
  if (usuarioPorUsername && Number(usuarioPorUsername.id) !== Number(id)) {
    const error: any = new Error("El nombre de usuario ya existe");
    error.code = "USERNAME_DUPLICADO";
    throw error;
  }

  return await actualizarUsuario(id, username, email);
};

export const eliminarUsuarioServicio = async (id: number) => {
  return await eliminarUsuario(id);
};