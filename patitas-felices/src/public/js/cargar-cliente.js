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

if (datosUsuario.role !== "admin") {
  alert("No tenés permisos para ingresar a esta página");
  window.location.href = "/dashboard";
}

const btnVolverDashboard = document.getElementById("btnVolverDashboard");
const btnCargarDueno = document.getElementById("btnCargarDueno");
const btnCargarMascota = document.getElementById("btnCargarMascota");
const btnCargarVeterinario = document.getElementById("btnCargarVeterinario");
const btnCargarHistorial = document.getElementById("btnCargarHistorial");

const estadoDueno = document.getElementById("estadoDueno");
const estadoMascota = document.getElementById("estadoMascota");
const estadoVeterinario = document.getElementById("estadoVeterinario");
const estadoHistorial = document.getElementById("estadoHistorial");

const inputNombreDueno = document.getElementById("nombreDueno");
const inputApellidoDueno = document.getElementById("apellidoDueno");
const inputTelefonoDueno = document.getElementById("telefonoDueno");
const inputDireccionDueno = document.getElementById("direccionDueno");

const inputNombreMascota = document.getElementById("nombreMascota");
const inputEspecieMascota = document.getElementById("especieMascota");
const inputFechaNacimientoMascota = document.getElementById("fechaNacimientoMascota");
const inputIdDuenoMascota = document.getElementById("idDuenoMascota");

const inputNombreVeterinario = document.getElementById("nombreVeterinario");
const inputApellidoVeterinario = document.getElementById("apellidoVeterinario");
const inputMatriculaVeterinario = document.getElementById("matriculaVeterinario");
const inputEspecialidadVeterinario = document.getElementById("especialidadVeterinario");

const inputIdMascotaHistorial = document.getElementById("idMascotaHistorial");
const selectVeterinario = document.getElementById("selectVeterinario");
const textareaDescripcionHistorial = document.getElementById("descripcionHistorial");

let idDuenoCreado = null;
let idMascotaCreada = null;

btnVolverDashboard.addEventListener("click", () => {
  window.location.href = "/dashboard";
});

function habilitarPasoMascota() {
  inputNombreMascota.disabled = false;
  inputEspecieMascota.disabled = false;
  inputFechaNacimientoMascota.disabled = false;
  inputIdDuenoMascota.disabled = false;
  btnCargarMascota.disabled = false;
}

function habilitarPasoHistorial() {
  inputIdMascotaHistorial.disabled = false;
  selectVeterinario.disabled = false;
  textareaDescripcionHistorial.disabled = false;
  btnCargarHistorial.disabled = false;
}

function limpiarFormularioDueno() {
  inputNombreDueno.value = "";
  inputApellidoDueno.value = "";
  inputTelefonoDueno.value = "";
  inputDireccionDueno.value = "";
}

function limpiarFormularioMascota() {
  inputNombreMascota.value = "";
  inputEspecieMascota.value = "";
  inputFechaNacimientoMascota.value = "";
}

function limpiarFormularioVeterinario() {
  inputNombreVeterinario.value = "";
  inputApellidoVeterinario.value = "";
  inputMatriculaVeterinario.value = "";
  inputEspecialidadVeterinario.value = "";
}

async function cargarVeterinarios() {
  try {
    const respuesta = await fetch("/veterinarios", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!respuesta.ok) {
      estadoVeterinario.textContent = "No se pudieron cargar los veterinarios.";
      return;
    }

    const veterinarios = await respuesta.json();

    selectVeterinario.innerHTML = `
      <option value="">Seleccionar veterinario</option>
    `;

    veterinarios.forEach((veterinario) => {
      selectVeterinario.innerHTML += `
        <option value="${veterinario.id}">
          ${veterinario.nombre} ${veterinario.apellido} - ${veterinario.especialidad}
        </option>
      `;
    });
  } catch (error) {
    console.error(error);
    estadoVeterinario.textContent = "Error cargando la lista de veterinarios.";
  }
}

btnCargarDueno.addEventListener("click", async () => {
  const nombre = inputNombreDueno.value.trim();
  const apellido = inputApellidoDueno.value.trim();
  const telefono = inputTelefonoDueno.value.trim();
  const direccion = inputDireccionDueno.value.trim();

  if (!nombre || !apellido || !telefono) {
    alert("Nombre, apellido y teléfono del dueño son obligatorios");
    return;
  }

  try {
    const respuesta = await fetch("/duenos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre,
        apellido,
        telefono,
        direccion
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudo cargar el dueño");
      return;
    }

    idDuenoCreado = datos.id;
    inputIdDuenoMascota.value = idDuenoCreado;

    estadoDueno.textContent = `Dueño cargado correctamente. ID generado: ${idDuenoCreado}`;
    estadoMascota.textContent = "Ahora ya podés cargar la mascota.";
    habilitarPasoMascota();
    limpiarFormularioDueno();

    btnCargarDueno.disabled = true;
  } catch (error) {
    console.error(error);
    alert("Error cargando dueño");
  }
});

btnCargarMascota.addEventListener("click", async () => {
  const nombre = inputNombreMascota.value.trim();
  const especie = inputEspecieMascota.value.trim();
  const fecha = inputFechaNacimientoMascota.value;
  const dueno = inputIdDuenoMascota.value;

  if (!idDuenoCreado) {
    alert("Primero debés cargar el dueño");
    return;
  }

  if (!nombre || !especie) {
    alert("Nombre y especie de la mascota son obligatorios");
    return;
  }

  try {
    const respuesta = await fetch("/animals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre,
        especie,
        fecha,
        dueno
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudo cargar la mascota");
      return;
    }

    idMascotaCreada = datos.id;
    inputIdMascotaHistorial.value = idMascotaCreada;

    estadoMascota.textContent = `Mascota cargada correctamente. ID generado: ${idMascotaCreada}`;
    estadoHistorial.textContent = "Ahora ya podés cargar el historial clínico.";
    habilitarPasoHistorial();
    limpiarFormularioMascota();

    btnCargarMascota.disabled = true;
    inputNombreMascota.disabled = true;
    inputEspecieMascota.disabled = true;
    inputFechaNacimientoMascota.disabled = true;
    inputIdDuenoMascota.disabled = true;
  } catch (error) {
    console.error(error);
    alert("Error cargando mascota");
  }
});

btnCargarVeterinario.addEventListener("click", async () => {
  const nombre = inputNombreVeterinario.value.trim();
  const apellido = inputApellidoVeterinario.value.trim();
  const matricula = inputMatriculaVeterinario.value.trim();
  const especialidad = inputEspecialidadVeterinario.value.trim();

  if (!nombre || !apellido || !matricula || !especialidad) {
    alert("Nombre, apellido, matrícula y especialidad del veterinario son obligatorios");
    return;
  }

  try {
    const respuesta = await fetch("/veterinarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre,
        apellido,
        matricula,
        especialidad
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudo cargar el veterinario");
      return;
    }

    estadoVeterinario.textContent = `Veterinario cargado correctamente. ID generado: ${datos.id}`;
    limpiarFormularioVeterinario();
    await cargarVeterinarios();

    if (datos.id) {
      selectVeterinario.value = String(datos.id);
    }
  } catch (error) {
    console.error(error);
    alert("Error cargando veterinario");
  }
});

btnCargarHistorial.addEventListener("click", async () => {
  const idMascota = inputIdMascotaHistorial.value;
  const idVeterinario = selectVeterinario.value;
  const descripcion = textareaDescripcionHistorial.value.trim();

  if (!idMascotaCreada) {
    alert("Primero debés cargar la mascota");
    return;
  }

  if (!descripcion) {
    alert("La descripción del historial clínico es obligatoria");
    return;
  }

  try {
    const respuesta = await fetch("/historiales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        idMascota,
        idVeterinario: idVeterinario || null,
        descripcion
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.mensaje || "No se pudo cargar el historial clínico");
      return;
    }

    estadoHistorial.textContent = `Historial clínico cargado correctamente. ID generado: ${datos.id}`;

    textareaDescripcionHistorial.value = "";
    selectVeterinario.value = "";

    btnCargarHistorial.disabled = true;
    textareaDescripcionHistorial.disabled = true;
    selectVeterinario.disabled = true;
    inputIdMascotaHistorial.disabled = true;
  } catch (error) {
    console.error(error);
    alert("Error cargando historial clínico");
  }
});

cargarVeterinarios();