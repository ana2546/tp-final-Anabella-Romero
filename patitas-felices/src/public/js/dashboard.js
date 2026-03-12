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
const nombreUsuario = datosUsuario.username;

const logoutBtn = document.getElementById("logoutBtn");
const btnCargarCliente = document.getElementById("btnCargarCliente");
const btnRegistrarUsuario = document.getElementById("btnRegistrarUsuario");
const searchInput = document.getElementById("searchInput");
const textoBienvenida = document.getElementById("textoBienvenida");
const textoRol = document.getElementById("textoRol");

textoBienvenida.textContent = `Bienvenido/a, ${nombreUsuario}`;

if (rolUsuario === "admin") {
  textoRol.textContent = "Rol: administrador";
  btnCargarCliente.classList.remove("oculto");
  btnRegistrarUsuario.classList.remove("oculto");
} else {
  textoRol.textContent = "Rol: usuario";
  btnCargarCliente.classList.add("oculto");
  btnRegistrarUsuario.classList.add("oculto");
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/";
});

btnCargarCliente.addEventListener("click", () => {
  if (rolUsuario === "admin") {
    window.location.href = "/cargar-cliente";
  }
});

btnRegistrarUsuario.addEventListener("click", () => {
  if (rolUsuario === "admin") {
    window.location.href = "/register";
  }
});

async function cargarAnimales() {
  try {
    const respuesta = await fetch("/animals", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (respuesta.status === 401 || respuesta.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    if (!respuesta.ok) {
      alert("No se pudieron cargar los animales");
      return;
    }

    const animales = await respuesta.json();
    renderizarAnimales(animales);
  } catch (error) {
    console.error(error);
    alert("Error cargando animales");
  }
}

function renderizarAnimales(animales) {
  const tabla = document.getElementById("animalsTable");
  tabla.innerHTML = "";

  if (!animales || animales.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="5">No se encontraron animales</td>
      </tr>
    `;
    return;
  }

  animales.forEach((animal) => {
    tabla.innerHTML += `
      <tr>
        <td>${animal.name}</td>
        <td>${animal.owner}</td>
        <td>${animal.vet}</td>
        <td>${animal.history}</td>
        <td>
          <button class="boton-tabla" onclick="verFichaAnimal(${animal.id})">
            Ver ficha
          </button>
        </td>
      </tr>
    `;
  });
}

window.verFichaAnimal = function (id) {
  window.location.href = `/animal?id=${id}`;
};

searchInput.addEventListener("keyup", async () => {
  const q = searchInput.value.trim();

  if (q === "") {
    cargarAnimales();
    return;
  }

  try {
    const respuesta = await fetch(`/animals/search?q=${encodeURIComponent(q)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!respuesta.ok) {
      alert("Error buscando animales");
      return;
    }

    const animales = await respuesta.json();
    renderizarAnimales(animales);
  } catch (error) {
    console.error(error);
    alert("Error buscando animales");
  }
});

cargarAnimales();