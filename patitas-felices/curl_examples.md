# =========================
# LOGIN
# =========================

curl -X POST http://localhost:5000/auth/login \
-H "Content-Type: application/json" \
-d '{
"email": "admin@mail.com",
"password": "Admin123!"
}'

# Guardar el token recibido en la respuesta
TOKEN="TU_TOKEN_JWT_AQUI"



# =========================
# REGISTRAR VETERINARIO (ADMIN)
# =========================

curl -X POST http://localhost:5000/auth/register \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
"username":"vetnuevo",
"email":"vetnuevo@mail.com",
"password":"Vet123!",
"nombre":"Carlos",
"apellido":"Lopez",
"matricula":"VET2025",
"especialidad":"Clinica general"
}'



# =========================
# LISTAR MASCOTAS
# =========================

curl http://localhost:5000/animals \
-H "Authorization: Bearer $TOKEN"



# =========================
# BUSCAR MASCOTA
# =========================

curl "http://localhost:5000/animals/search?q=firulais" \
-H "Authorization: Bearer $TOKEN"



# =========================
# CREAR DUEÑO
# =========================

curl -X POST http://localhost:5000/duenos \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
"nombre":"Juan",
"apellido":"Perez",
"telefono":"1122334455",
"direccion":"Av Siempre Viva 123"
}'



# =========================
# CREAR MASCOTA
# =========================

curl -X POST http://localhost:5000/animals \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
"nombre":"Firulais",
"especie":"Perro",
"fecha":"2020-05-10",
"dueno":1
}'



# =========================
# CREAR HISTORIAL CLINICO
# =========================

curl -X POST http://localhost:5000/historiales \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
"idMascota":1,
"idVeterinario":1,
"descripcion":"Control general y vacunacion"
}'



# =========================
# OBTENER HISTORIAL DE UNA MASCOTA
# =========================

curl http://localhost:5000/historiales/mascota/1 \
-H "Authorization: Bearer $TOKEN"



# =========================
# MODIFICAR HISTORIAL CLINICO
# =========================

curl -X PUT http://localhost:5000/historiales/1 \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
"descripcion":"Control general, vacunacion y desparasitacion"
}'



# =========================
# LISTAR USUARIOS (ADMIN)
# =========================

curl http://localhost:5000/usuarios-api \
-H "Authorization: Bearer $TOKEN"



# =========================
# MODIFICAR USUARIO
# =========================

curl -X PUT http://localhost:5000/usuarios-api/2 \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
"username":"nuevoNombre",
"email":"nuevo@mail.com"
}'



# =========================
# ELIMINAR USUARIO
# =========================

curl -X DELETE http://localhost:5000/usuarios-api/2 \
-H "Authorization: Bearer $TOKEN"

 const bcrypt = require("bcrypt")
  bcrypt.hashSync("Admin123-",10)