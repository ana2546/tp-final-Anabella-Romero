const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadPet() {
  try {
    const res = await fetch(`/animals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert("Error cargando mascota");
      return;
    }

    const pet = await res.json();

    if (!pet) {
      alert("Mascota no encontrada");
      return;
    }

    document.getElementById("nombre").value = pet.nombre || "";
    document.getElementById("especie").value = pet.especie || "";
    document.getElementById("fecha").value = pet.fecha_nacimiento
      ? pet.fecha_nacimiento.split("T")[0]
      : "";
    document.getElementById("dueno").value = pet.id_duenos || "";

  } catch (error) {
    console.error(error);
    alert("Error cargando datos");
  }
}

const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;
  const especie = document.getElementById("especie").value;
  const fecha = document.getElementById("fecha").value;
  const dueno = document.getElementById("dueno").value;

  await fetch(`/animals/${id}`, {
    method: "PUT",
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

  alert("Mascota actualizada");
  window.location.href = "/dashboard";
});

loadPet();