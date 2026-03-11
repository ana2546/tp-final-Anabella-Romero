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

if (!datosUsuario) {
  localStorage.removeItem("token");
  window.location.href = "/";
}

const rolUsuario = datosUsuario.role;

const params = new URLSearchParams(window.location.search);
const idMascota = params.get("id");

if (!idMascota) {
  alert("No se recibió el id del animal");
  window.location.href = "/dashboard";
}

const btnVolverDashboard = document.getElementById("btnVolverDashboard");
const textoPermisosHistorial = document.getElementById("textoPermisosHistorial");

btnVolverDashboard.addEventListener("click", () => {
  window.location.href = "/dashboard";
});

if (rolUsuario === "user") {
  textoPermisosHistorial.textContent =
    "Como usuario podés editar el historial clínico.";
} else {
  textoPermisosHistorial.textContent =
    "Como administrador podés visualizar toda la información.";
}

function formatearFecha(fecha) {
  if (!fecha) return "-";

  const fechaObjeto = new Date(fecha);

  if (isNaN(fechaObjeto.getTime())) {
    return fecha;
  }

  return fechaObjeto.toLocaleDateString("es-AR");
}

async function obtenerMascota() {
  const respuesta = await fetch(`/animals/${idMascota}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener la mascota");
  }

  return await respuesta.json();
}

async function obtenerDueno(idDueno) {
  const respuesta = await fetch(`/duenos/${idDueno}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el dueño");
  }

  return await respuesta.json();
}

async function obtenerHistoriales() {
  const respuesta = await fetch(`/historiales/mascota/${idMascota}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los historiales");
  }

  return await respuesta.json();
}

function cargarDatosMascota(mascota) {
  document.getElementById("detalleMascotaId").textContent = mascota.id ?? "-";
  document.getElementById("detalleMascotaNombre").textContent = mascota.nombre ?? "-";
  document.getElementById("detalleMascotaEspecie").textContent = mascota.especie ?? "-";
  document.getElementById("detalleMascotaFechaNacimiento").textContent =
    mascota.fecha_nacimiento
      ? formatearFecha(mascota.fecha_nacimiento)
      : "-";
}

function cargarDatosDueno(dueno) {
  document.getElementById("detalleDuenoId").textContent = dueno.id ?? "-";
  document.getElementById("detalleDuenoNombre").textContent = dueno.nombre ?? "-";
  document.getElementById("detalleDuenoApellido").textContent = dueno.apellido ?? "-";
  document.getElementById("detalleDuenoTelefono").textContent = dueno.telefono ?? "-";
  document.getElementById("detalleDuenoDireccion").textContent = dueno.direccion ?? "-";
}

function cargarDatosVeterinario(historiales) {
  const ultimoHistorialConVeterinario = historiales.find(
    (historial) => historial.id_veterinario
  );

  if (!ultimoHistorialConVeterinario) {
    document.getElementById("detalleVeterinarioNombre").textContent = "-";
    document.getElementById("detalleVeterinarioApellido").textContent = "-";
    document.getElementById("detalleVeterinarioMatricula").textContent = "-";
    document.getElementById("detalleVeterinarioEspecialidad").textContent = "-";
    return;
  }

  document.getElementById("detalleVeterinarioNombre").textContent =
    ultimoHistorialConVeterinario.veterinario_nombre ?? "-";

  document.getElementById("detalleVeterinarioApellido").textContent =
    ultimoHistorialConVeterinario.veterinario_apellido ?? "-";

  document.getElementById("detalleVeterinarioMatricula").textContent =
    ultimoHistorialConVeterinario.matricula ?? "-";

  document.getElementById("detalleVeterinarioEspecialidad").textContent =
    ultimoHistorialConVeterinario.especialidad ?? "-";
}

function renderizarHistoriales(historiales) {
  const tabla = document.getElementById("tablaHistorialClinico");
  tabla.innerHTML = "";

  if (!historiales || historiales.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="7">No hay registros de historial clínico para esta mascota.</td>
      </tr>
    `;
    return;
  }

  historiales.forEach((historial) => {
    let acciones = "Solo lectura";

    if (rolUsuario === "user") {
      acciones = `
        <button class="boton-tabla" onclick="editarHistorial(${historial.id})">
          Editar historial
        </button>
      `;
    }

    tabla.innerHTML += `
      <tr>
        <td>${historial.id}</td>
        <td>${formatearFecha(historial.fecha_registro)}</td>
        <td>${(historial.veterinario_nombre ?? "")} ${(historial.veterinario_apellido ?? "")}</td>
        <td>${historial.matricula ?? "-"}</td>
        <td>${historial.especialidad ?? "-"}</td>
        <td>${historial.descripcion ?? "-"}</td>
        <td>${acciones}</td>
      </tr>
    `;
  });
}

window.editarHistorial = function (idHistorial) {
  if (rolUsuario !== "user") return;

  window.location.href = `/edit-history?id=${idHistorial}&mascota=${idMascota}`;
};

async function cargarFichaAnimal() {
  try {
    const mascota = await obtenerMascota();
    cargarDatosMascota(mascota);

    const dueno = await obtenerDueno(mascota.id_duenos);
    cargarDatosDueno(dueno);

    const historiales = await obtenerHistoriales();
    cargarDatosVeterinario(historiales);
    renderizarHistoriales(historiales);
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar la ficha del animal");
  }
}

cargarFichaAnimal();