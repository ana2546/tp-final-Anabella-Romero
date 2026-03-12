const token = localStorage.getItem("token");

if (!token) {
  alert("Solo un administrador puede ingresar a esta página");
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
  alert("No tenés permisos para registrar usuarios");
  window.location.href = "/dashboard";
}

const btnVolverDashboard = document.getElementById("btnVolverDashboard");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnRecargarVeterinarios = document.getElementById("btnRecargarVeterinarios");
const tablaVeterinarios = document.getElementById("tablaVeterinarios");

btnVolverDashboard.addEventListener("click", () => {
  window.location.href = "/dashboard";
});

btnRegistrar.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const matricula = document.getElementById("matricula").value.trim();
  const especialidad = document.getElementById("especialidad").value.trim();

  if (
    !username ||
    !email ||
    !password ||
    !nombre ||
    !apellido ||
    !matricula ||
    !especialidad
  ) {
    alert("Todos los campos son obligatorios");
    return;
  }

  try {
    const respuesta = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        email,
        password,
        nombre,
        apellido,
        matricula,
        especialidad
      })
    });

    const textoRespuesta = await respuesta.text();

    let datos = {};
    try {
      datos = JSON.parse(textoRespuesta);
    } catch (e) {
      datos = { error: textoRespuesta };
    }

    if (!respuesta.ok) {
      const mensaje =
        datos.error ||
        (datos.errores && datos.errores[0]?.msg) ||
        "No se pudo registrar el usuario veterinario";

      alert(mensaje);
      return;
    }

    alert("Usuario veterinario registrado correctamente");

    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("matricula").value = "";
    document.getElementById("especialidad").value = "";

    cargarVeterinarios();
  } catch (error) {
    console.error(error);
    alert("Error registrando usuario veterinario");
  }
});

btnRecargarVeterinarios.addEventListener("click", () => {
  cargarVeterinarios();
});

async function cargarVeterinarios() {
  try {
    const respuesta = await fetch("/veterinarios", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudieron cargar los veterinarios");
      return;
    }

    renderizarVeterinarios(datos);
  } catch (error) {
    console.error(error);
    alert("Error cargando veterinarios");
  }
}

function renderizarVeterinarios(veterinarios) {
  tablaVeterinarios.innerHTML = "";

  if (!veterinarios || veterinarios.length === 0) {
    tablaVeterinarios.innerHTML = `
      <tr>
        <td colspan="7">No hay veterinarios registrados.</td>
      </tr>
    `;
    return;
  }

  veterinarios.forEach((veterinario) => {
    tablaVeterinarios.innerHTML += `
      <tr>
        <td>${veterinario.id}</td>
        <td>${veterinario.nombre}</td>
        <td>${veterinario.apellido}</td>
        <td>${veterinario.matricula}</td>
        <td>${veterinario.especialidad}</td>
        <td>${veterinario.id_usuario ?? "-"}</td>
        <td>
          <button class="boton-eliminar" onclick="eliminarVeterinario(${veterinario.id}, '${veterinario.nombre.replace(/'/g, "\\'")} ${veterinario.apellido.replace(/'/g, "\\'")}')">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}

window.eliminarVeterinario = async function (id, nombreCompleto) {
  const confirmar = confirm(`¿Seguro que querés eliminar al veterinario "${nombreCompleto}"?`);
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`/veterinarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudo eliminar el veterinario");
      return;
    }

    alert("Veterinario eliminado correctamente");
    cargarVeterinarios();
  } catch (error) {
    console.error(error);
    alert("Error eliminando veterinario");
  }
};

cargarVeterinarios();