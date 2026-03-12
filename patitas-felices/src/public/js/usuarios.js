const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/";
}

function decodificarToken(token) {
  try {
    const payload = token.split(".")[1];
    const payloadDecodificado = atob(payload);
    return JSON.parse(payloadDecodificado);
  } catch (error) {
    console.error("Error decodificando token", error);
    return null;
  }
}

const datosUsuario = decodificarToken(token);

if (!datosUsuario || datosUsuario.role !== "admin") {
  alert("No tenés permisos para ingresar a esta página");
  window.location.href = "/dashboard";
}

const idAdminLogueado = Number(datosUsuario.id);

const btnVolverDashboard = document.getElementById("btnVolverDashboard");
const tablaUsuarios = document.getElementById("tablaUsuarios");
const seccionEditarUsuario = document.getElementById("seccionEditarUsuario");
const editarUsername = document.getElementById("editarUsername");
const editarEmail = document.getElementById("editarEmail");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");

let idUsuarioEnEdicion = null;

btnVolverDashboard.addEventListener("click", () => {
  window.location.href = "/dashboard";
});

btnCancelarEdicion.addEventListener("click", () => {
  idUsuarioEnEdicion = null;
  editarUsername.value = "";
  editarEmail.value = "";
  seccionEditarUsuario.classList.add("oculto");
});

btnGuardarEdicion.addEventListener("click", async () => {
  if (!idUsuarioEnEdicion) return;

  const username = editarUsername.value.trim();
  const email = editarEmail.value.trim();

  if (!username || !email) {
    alert("El nombre de usuario y el email son obligatorios");
    return;
  }

  try {
    const respuesta = await fetch(`/usuarios-api/${idUsuarioEnEdicion}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        email
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudo actualizar el usuario");
      return;
    }

    alert("Usuario actualizado correctamente");

    idUsuarioEnEdicion = null;
    editarUsername.value = "";
    editarEmail.value = "";
    seccionEditarUsuario.classList.add("oculto");

    cargarUsuarios();
  } catch (error) {
    console.error(error);
    alert("Error actualizando usuario");
  }
});

async function cargarUsuarios() {
  try {
    const respuesta = await fetch("/usuarios-api", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudieron cargar los usuarios");
      return;
    }

    renderizarUsuarios(datos);
  } catch (error) {
    console.error(error);
    alert("Error cargando usuarios");
  }
}

function renderizarUsuarios(usuarios) {
  tablaUsuarios.innerHTML = "";

  if (!usuarios || usuarios.length === 0) {
    tablaUsuarios.innerHTML = `
      <tr>
        <td colspan="5">No hay usuarios cargados.</td>
      </tr>
    `;
    return;
  }

  usuarios.forEach((usuario) => {
    const esAdminLogueado = Number(usuario.id) === idAdminLogueado;

    let acciones = `
      <button class="boton-tabla" onclick="modificarUsuario(${usuario.id}, '${usuario.username.replace(/'/g, "\\'")}', '${usuario.email.replace(/'/g, "\\'")}')">
        Modificar
      </button>
    `;

    if (!esAdminLogueado) {
      acciones += `
        <button class="boton-eliminar" onclick="eliminarUsuario(${usuario.id}, '${usuario.username.replace(/'/g, "\\'")}')">
          Eliminar
        </button>
      `;
    }

    tablaUsuarios.innerHTML += `
      <tr>
        <td>${usuario.id}</td>
        <td>${usuario.username}</td>
        <td>${usuario.email}</td>
        <td>${usuario.role ?? "-"}</td>
        <td>${acciones}</td>
      </tr>
    `;
  });
}

window.modificarUsuario = function (id, username, email) {
  idUsuarioEnEdicion = id;
  editarUsername.value = username;
  editarEmail.value = email;
  seccionEditarUsuario.classList.remove("oculto");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

window.eliminarUsuario = async function (id, username) {
  const confirmar = confirm(`¿Seguro que querés eliminar al usuario "${username}"?`);
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`/usuarios-api/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudo eliminar el usuario");
      return;
    }

    alert("Usuario eliminado correctamente");
    cargarUsuarios();
  } catch (error) {
    console.error(error);
    alert("Error eliminando usuario");
  }
};

cargarUsuarios();