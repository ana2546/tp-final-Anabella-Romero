CREATE DATABASE IF NOT EXISTS veterinaria_patitas_felices;
USE veterinaria_patitas_felices;

-- =========================
-- TABLA ROLES
-- =========================
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT IGNORE INTO roles (name) VALUES
('admin'),
('user');

-- =========================
-- TABLA USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- TABLA USER_ROLES
-- =========================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- TRIGGER: ASIGNAR ROL USER
-- =========================
DROP TRIGGER IF EXISTS assign_user_role;

DELIMITER $$

CREATE TRIGGER assign_user_role
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE userRoleId INT;

    SELECT id INTO userRoleId
    FROM roles
    WHERE name = 'user'
    LIMIT 1;

    IF userRoleId IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id)
        VALUES (NEW.id, userRoleId);
    END IF;
END$$

DELIMITER ;

-- =========================
-- TABLA DUENOS
-- =========================
CREATE TABLE IF NOT EXISTS duenos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(100)
);

-- =========================
-- TABLA VETERINARIOS
-- =========================
CREATE TABLE IF NOT EXISTS veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    especialidad VARCHAR(50) NOT NULL,
    id_usuario INT UNIQUE NULL,
    CONSTRAINT fk_veterinario_usuario
        FOREIGN KEY (id_usuario) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- TABLA MASCOTAS
-- =========================
CREATE TABLE IF NOT EXISTS mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(30) NOT NULL,
    fecha_nacimiento DATE,
    id_duenos INT NOT NULL,
    CONSTRAINT fk_mascota_dueno
        FOREIGN KEY (id_duenos) REFERENCES duenos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================
-- TABLA HISTORIAL_CLINICO
-- =========================
CREATE TABLE IF NOT EXISTS historial_clinico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_mascota INT NOT NULL,
    id_veterinario INT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(250) NOT NULL,
    CONSTRAINT fk_historial_mascota
        FOREIGN KEY (id_mascota) REFERENCES mascotas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_historial_veterinario
        FOREIGN KEY (id_veterinario) REFERENCES veterinarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);






IMPORTANTE PARA CREAR UN PRIMER USUARIO ADMINISTRADOR:


INSERT INTO users (username, email, password)
VALUES (
  'admin',
  'admin@mail.com',
  '$2b$10$exWWJPJwuJ3QmdnPbeiqzed8vEjZjGSOGvySbqfCBWVTZEFgjcqyq'
);

UPDATE user_roles
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE user_id = 1;