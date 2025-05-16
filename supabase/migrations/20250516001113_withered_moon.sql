CREATE DATABASE CarreraCapital;
GO

USE CarreraCapital;
GO

CREATE TABLE Certificados (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    apellido NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    telefono NVARCHAR(50) NOT NULL,
    apartamento NVARCHAR(50) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    tipo_documento NVARCHAR(50) NOT NULL,
    numero_documento NVARCHAR(50) NOT NULL,
    proposito NVARCHAR(MAX),
    fecha_solicitud DATETIME NOT NULL,
    estado NVARCHAR(20) NOT NULL DEFAULT 'pendiente'
);
GO