let token = "";

async function login() {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@test.com",
      password: "123456"
    })
  });

  const data = await res.json();
  token = data.token;
  console.log("TOKEN:", token);
}

async function crearMascota() {
  await fetch("/api/mascotas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      nombre: "Firulais",
      especie: "Perro",
      edad: 3
    })
  });
}

login();
