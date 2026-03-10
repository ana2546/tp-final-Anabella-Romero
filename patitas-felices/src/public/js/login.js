const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const res = await fetch("/auth/login", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
email,
password
})

});

const data = await res.json();

if(!res.ok){
const validationMessage = Array.isArray(data.errors) && data.errors.length
? data.errors.map((err) => err.msg).join("\n")
: null;

alert(validationMessage || data.error || data.message || "Error login");
return;
}

localStorage.setItem("token", data.token);

window.location.href = "/dashboard";

});