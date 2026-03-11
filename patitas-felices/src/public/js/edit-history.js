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

if (datosUsuario.role !== "user") {
  alert("No tenés permisos para editar historiales clínicos");
  window.location.href = "/dashboard";
}

const params = new URLSearchParams(window.location.search);
const idHistorial = params.get("id");
const idMascota = params.get("mascota");

if (!idHistorial) {
  alert("No se recibió el id del historial");
  window.location.href = "/dashboard";
}

const btnVolverFicha = document.getElementById("btnVolverFicha");
const btnGuardarHistorial = document.getElementById("btnGuardarHistorial");

btnVolverFicha.addEventListener("click", () => {
  if (idMascota) {
    window.location.href = `/animal?id=${idMascota}`;
  } else {
    window.location.href = "/dashboard";
  }
});

function formatearFecha(fecha) {
  if (!fecha) return "-";

  const fechaObjeto = new Date(fecha);

  if (isNaN(fechaObjeto.getTime())) {
    return fecha;
  }

  return fechaObjeto.toLocaleDateString("es-AR");
}

async function obtenerHistorial() {
  const respuesta = await fetch(`/historiales/${idHistorial}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (respuesta.status === 401 || respuesta.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el historial clínico");
  }

  return await respuesta.json();
}

function cargarDatosHistorial(historial) {
  document.getElementById("detalleHistorialId").textContent = historial.id ?? "-";
  document.getElementById("detalleHistorialMascota").textContent = historial.id_mascota ?? "-";
  document.getElementById("detalleHistorialFecha").textContent = formatearFecha(
    historial.fecha_registro
  );

  const nombreVeterinario = `${historial.veterinario_nombre ?? ""} ${historial.veterinario_apellido ?? ""}`.trim();

  document.getElementById("detalleHistorialVeterinario").textContent =
    nombreVeterinario || "Sin veterinario";

  document.getElementById("descripcionHistorial").value =
    historial.descripcion ?? "";
}

btnGuardarHistorial.addEventListener("click", async () => {
  const descripcion = document.getElementById("descripcionHistorial").value.trim();

  if (!descripcion) {
    alert("La descripción no puede estar vacía");
    return;
  }

  try {
    const respuesta = await fetch(`/historiales/${idHistorial}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        descripcion
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudo actualizar el historial clínico");
      return;
    }

    alert("Historial clínico actualizado correctamente");

    if (idMascota) {
      window.location.href = `/animal?id=${idMascota}`;
    } else {
      window.location.href = "/dashboard";
    }
  } catch (error) {
    console.error(error);
    alert("Error actualizando historial clínico");
  }
});

async function cargarPantalla() {
  try {
    const historial = await obtenerHistorial();

    if (!historial) return;

    cargarDatosHistorial(historial);
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar el historial clínico");
  }
}

cargarPantalla();