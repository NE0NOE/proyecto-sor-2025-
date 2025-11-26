-- Script para configurar la base de datos
-- Ejecutar con: sudo mysql < setup_db.sql

CREATE DATABASE IF NOT EXISTS cine_db;
USE cine_db;

-- Crear usuario si no existe (ajusta la contraseña)
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON cine_db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;

-- Aquí puedes agregar las tablas si tienes el esquema
-- CREATE TABLE ...
