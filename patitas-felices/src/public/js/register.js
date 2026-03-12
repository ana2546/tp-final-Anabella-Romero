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

    const datos = await respuesta.json();

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
  } catch (error) {
    console.error(error);
    alert("Error registrando usuario veterinario");
  }
});