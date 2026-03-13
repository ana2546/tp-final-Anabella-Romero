# Patitas Felices – Sistema de Gestión Veterinaria

## Descripción general del proyecto

Patitas Felices es un sistema de gestión para una clínica veterinaria que permite administrar dueños, mascotas, veterinarios y el historial clínico de los animales.
El veterinario recibe el rol de user unicamente y tiene permitido solo modificar los historiales de las mascotas cargadas. El administrador tiene la potestad de :

 - Cargar mascotas,veterinarios/usuarios y el primer historial clinico.

 - Modificar mascotas,veterinarios/usuarios.

 - Eliminar mascotas, veterinarios/usuarios e historial clinico
 
El sistema permite:

- Registrar veterinarios con acceso al sistema
- Gestionar dueños y mascotas
- Registrar y consultar historiales clínicos
- Buscar mascotas por nombre o dueño
- Controlar accesos mediante autenticación con JWT
- Gestionar usuarios desde una cuenta administrador

El sistema cuenta con un backend desarrollado en Node.js con arquitectura MVC y un frontend básico en HTML, CSS y JavaScript que consume la API REST.

---

# Tecnologías utilizadas

## Backend

- Node.js
- Express
- TypeScript
- Arquitectura MVC
- JWT para autenticación
- bcrypt para encriptación de contraseñas
- express-validator para validaciones

## Base de datos

- MySQL
- mysql2
- Claves primarias y foráneas
- Integridad referencial

## Frontend

- HTML
- CSS
- JavaScript
- Fetch API para consumo del backend

El frontend se encuentra dentro de la carpeta:

public/

---

# Instrucciones de instalación

## 1. Clonar el repositorio

git clone https://github.com/ana2546/tp-final-Anabella-Romero.git
cd patitas-felices

## 2. Instalar dependencias

npm install

---

# Configuración de base de datos

Crear la base de datos en MySQL.

Luego importar el archivo dump incluido en el proyecto:

db.sql

Ejemplo:

mysql -u root -p veterinaria_patitas_felices < db.sql

Esto creará las tablas:

- users
- roles
- user_roles
- duenos
- veterinarios
- mascotas
- historial_clinico

El sistema utiliza un trigger que asigna automáticamente el rol `user` a cada nuevo usuario registrado.

---

# Crear el primer usuario administrador (OBLIGATORIO)(SE ENCUENTRA EN EL DUMP)

Antes de iniciar el sistema, se debe crear manualmente el primer usuario administrador ya que el register no es abierto a cualquiera y solo deben registrarse personal de la veterinaria. 


EN PHPMYADMIN ABRIR SQL Y LUEGO DE CREAR LA BASE DE DATOS EJECUTAR LOS SIGUIENTES COMANDOS DE A UNO POR VEZ.

INSERT INTO users (username, email, password)
VALUES (
  'admin',
  'admin@mail.com',
  '$2b$10$exWWJPJwuJ3QmdnPbeiqzed8vEjZjGSOGvySbqfCBWVTZEFgjcqyq'
);

UPDATE user_roles
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE user_id = 'aca va el nro de id del usuario admin que se acaba de crear';



# Variables de entorno requeridas

Crear un archivo `.env` en la raíz del proyecto, como se ve en el archivo .env.example

Ejemplo:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=veterinaria_patitas_felices

JWT_SECRET=vamos-a-poner-algo-raro-aqui  
JWT_EXPIRES_IN=1d

---

El JWT_SECRET poner lo mismo ya que el hash de la contraseña inicial del admin depente de esto.

# Pasos para ejecutar el proyecto

## 1. Iniciar el servidor

npm run dev

El servidor iniciará en:

http://localhost:5000

---

## 2. Acceder al sistema

Abrir en el navegador:

http://localhost:5000/login

Credenciales iniciales:

email: admin@mail.com  
password: Admin123-

---

# Ejemplos de endpoints principales

## Login

curl -X POST http://localhost:5000/auth/login \
-H "Content-Type: application/json" \
-d '{
"email": "admin@mail.com",
"password": "Admin123-"
}'

---

## Registrar veterinario (admin)

curl -X POST http://localhost:5000/auth/register \
-H "Authorization: Bearer TOKEN" \
-H "Content-Type: application/json" \
-d '{
"username":"vetnuevo",
"email":"vet@mail.com",
"password":"Vet123!",
"nombre":"Carlos",
"apellido":"Lopez",
"matricula":"VET2025",
"especialidad":"Clinica"
}'

---

## Obtener mascotas

curl http://localhost:5000/animals \
-H "Authorization: Bearer TOKEN"

---

## Crear mascota

curl -X POST http://localhost:5000/animals \
-H "Authorization: Bearer TOKEN" \
-H "Content-Type: application/json" \
-d '{
"nombre":"Firulais",
"especie":"Perro",
"fecha":"2020-05-10",
"dueno":1
}'

---

## Crear historial clínico

curl -X POST http://localhost:5000/historiales \
-H "Authorization: Bearer TOKEN" \
-H "Content-Type: application/json" \
-d '{
"idMascota":1,
"idVeterinario":1,
"descripcion":"Control general"
}'

---

# Funcionalidades principales

- Autenticación JWT
- Roles de usuario (admin / veterinario)
- CRUD de mascotas
- CRUD de dueños
- Historial clínico de mascotas
- Gestión de usuarios por administrador
- Búsqueda de mascotas
- Interfaz web básica para consumir la API

---

# Opción de frontend utilizada

Se utilizó **HTML, CSS y JavaScript básico**, alojado dentro de la carpeta:

public/

El frontend consume la API del backend utilizando `fetch`.

No se utilizó framework frontend para mantener el proyecto simple y demostrar la integración directa con el backend.

---

