const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

e.preventDefault();

const username = document.getElementById("username").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const res = await fetch("/auth/register", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
username,
email,
password
})

});

const data = await res.json();

if(!res.ok){
const validationMessage = Array.isArray(data.errors) && data.errors.length
? data.errors.map((err) => err.msg).join("\n")
: null;

alert(validationMessage || data.error || data.message || "Error registro");
return;
}

alert("Usuario creado correctamente");

window.location.href = "/";

});