const token = localStorage.getItem("token");

if(!token){
window.location.href="/";
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click",()=>{

localStorage.removeItem("token");

window.location.href="/";

});

async function loadAnimals(){

const res = await fetch("/animals",{

headers:{
Authorization:`Bearer ${token}`
}

});

const animals = await res.json();

renderAnimals(animals);

}

function renderAnimals(animals){

const table = document.getElementById("animalsTable");

table.innerHTML = "";

animals.forEach(a=>{

table.innerHTML += `

<tr>

<td>${a.name}</td>

<td>${a.owner}</td>

<td>${a.vet}</td>

<td>${a.history}</td>

<td>

<button onclick="editPet(${a.id})">
Editar
</button>

<button onclick="deletePet(${a.id})">
Eliminar
</button>

</td>

</tr>

`;

});

}

async function deletePet(id){

await fetch(`/animals/${id}`,{

method:"DELETE",

headers:{
Authorization:`Bearer ${token}`
}

});

loadAnimals();

}

function editPet(id){

window.location.href = `/edit-pet?id=${id}`;

}

const addPetBtn = document.getElementById("addPetBtn");

addPetBtn.addEventListener("click", async ()=>{

const nombre = document.getElementById("nombre").value;
const especie = document.getElementById("especie").value;
const fecha = document.getElementById("fecha").value;
const dueno = document.getElementById("dueno").value;

await fetch("/animals",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({

nombre,
especie,
fecha,
dueno

})

});

loadAnimals();

});

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup",async()=>{

const q = searchInput.value;

if(q === ""){

loadAnimals();
return;

}

const res = await fetch(`/animals/search?q=${q}`,{

headers:{
Authorization:`Bearer ${token}`
}

});

const animals = await res.json();

renderAnimals(animals);

});

loadAnimals();
