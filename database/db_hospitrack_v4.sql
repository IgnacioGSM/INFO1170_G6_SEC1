/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.8-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Hospitrack
-- ------------------------------------------------------
-- Server version	10.11.8-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CentroSalud`
--

DROP TABLE IF EXISTS `CentroSalud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CentroSalud` (
  `idcentro` int(11) NOT NULL AUTO_INCREMENT,
  `latitud` varchar(20) DEFAULT NULL,
  `longitud` varchar(20) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idcentro`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CentroSalud`
--

LOCK TABLES `CentroSalud` WRITE;
/*!40000 ALTER TABLE `CentroSalud` DISABLE KEYS */;
INSERT INTO `CentroSalud` VALUES
(1,'-38.736703','-72.610633','Clinica Alemana');
/*!40000 ALTER TABLE `CentroSalud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EnEspera`
--

DROP TABLE IF EXISTS `EnEspera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EnEspera` (
  `idregistro` int(11) NOT NULL AUTO_INCREMENT,
  `rut` char(9) DEFAULT NULL,
  `idseccion` int(11) DEFAULT NULL,
  `horaregistro` datetime DEFAULT NULL,
  `prioridad` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`idregistro`),
  KEY `idseccion` (`idseccion`),
  KEY `rut` (`rut`),
  CONSTRAINT `EnEspera_ibfk_1` FOREIGN KEY (`idseccion`) REFERENCES `Seccion` (`idseccion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `EnEspera_ibfk_2` FOREIGN KEY (`rut`) REFERENCES `Persona` (`rut`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EnEspera`
--

LOCK TABLES `EnEspera` WRITE;
/*!40000 ALTER TABLE `EnEspera` DISABLE KEYS */;
/*!40000 ALTER TABLE `EnEspera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExpedienteMedico`
--

DROP TABLE IF EXISTS `ExpedienteMedico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ExpedienteMedico` (
  `idexpediente` int(11) NOT NULL AUTO_INCREMENT,
  `idusuario` int(11) DEFAULT NULL,
  `ruta_archivo` varchar(255) DEFAULT NULL,
  `nombre_archivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idexpediente`),
  KEY `idusuario` (`idusuario`),
  CONSTRAINT `ExpedienteMedico_ibfk_1` FOREIGN KEY (`idusuario`) REFERENCES `Usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExpedienteMedico`
--

LOCK TABLES `ExpedienteMedico` WRITE;
/*!40000 ALTER TABLE `ExpedienteMedico` DISABLE KEYS */;
/*!40000 ALTER TABLE `ExpedienteMedico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notificacion`
--

DROP TABLE IF EXISTS `Notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notificacion` (
  `idnoti` int(11) NOT NULL AUTO_INCREMENT,
  `idusuario` int(11) DEFAULT NULL,
  `mensaje` varchar(300) DEFAULT NULL,
  `leido` tinyint(1) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `idrespuesta` int(11) DEFAULT NULL,
  PRIMARY KEY (`idnoti`),
  KEY `Notificacion_ibfk_1` (`idusuario`),
  KEY `Notificacion_ibfk_2` (`idrespuesta`),
  CONSTRAINT `Notificacion_ibfk_1` FOREIGN KEY (`idusuario`) REFERENCES `Usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Notificacion_ibfk_2` FOREIGN KEY (`idrespuesta`) REFERENCES `RespuestaSolicitud` (`idrespuesta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notificacion`
--

LOCK TABLES `Notificacion` WRITE;
/*!40000 ALTER TABLE `Notificacion` DISABLE KEYS */;
INSERT INTO `Notificacion` VALUES
(1,13,'Solicitud Rechazada',0,NULL,3);
/*!40000 ALTER TABLE `Notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Persona`
--

DROP TABLE IF EXISTS `Persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Persona` (
  `rut` char(9) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Persona`
--

LOCK TABLES `Persona` WRITE;
/*!40000 ALTER TABLE `Persona` DISABLE KEYS */;
INSERT INTO `Persona` VALUES
('123456789','Juan','Pérez'),
('321654987','Ana','Martínez'),
('456789123','Carlos','López'),
('789123456','Luis','Rodríguez'),
('987654321','María','González');
/*!40000 ALTER TABLE `Persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReporteUsuario`
--

DROP TABLE IF EXISTS `ReporteUsuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ReporteUsuario` (
  `idreporte` int(11) NOT NULL AUTO_INCREMENT,
  `idusuario` int(11) DEFAULT NULL,
  `tiporeporte` varchar(50) DEFAULT NULL,
  `mensaje` varchar(300) DEFAULT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  `fechareporte` datetime DEFAULT NULL,
  PRIMARY KEY (`idreporte`),
  KEY `idusuario` (`idusuario`),
  CONSTRAINT `ReporteUsuario_ibfk_1` FOREIGN KEY (`idusuario`) REFERENCES `Usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReporteUsuario`
--

LOCK TABLES `ReporteUsuario` WRITE;
/*!40000 ALTER TABLE `ReporteUsuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `ReporteUsuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RespuestaSolicitud`
--

DROP TABLE IF EXISTS `RespuestaSolicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RespuestaSolicitud` (
  `idrespuesta` int(11) NOT NULL AUTO_INCREMENT,
  `idsolicitud` int(11) DEFAULT NULL,
  `idusuario` int(11) DEFAULT NULL,
  `mensaje` varchar(300) DEFAULT NULL,
  `estado` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`idrespuesta`),
  KEY `idsolicitud` (`idsolicitud`),
  KEY `idusuario` (`idusuario`),
  CONSTRAINT `RespuestaSolicitud_ibfk_1` FOREIGN KEY (`idsolicitud`) REFERENCES `Solicitud` (`idsolicitud`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RespuestaSolicitud_ibfk_2` FOREIGN KEY (`idusuario`) REFERENCES `Usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RespuestaSolicitud`
--

LOCK TABLES `RespuestaSolicitud` WRITE;
/*!40000 ALTER TABLE `RespuestaSolicitud` DISABLE KEYS */;
INSERT INTO `RespuestaSolicitud` VALUES
(2,10,14,'no me interesa','rechazado'),
(3,12,14,'no me interesa','rechazado');
/*!40000 ALTER TABLE `RespuestaSolicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Seccion`
--

DROP TABLE IF EXISTS `Seccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Seccion` (
  `idseccion` int(11) NOT NULL AUTO_INCREMENT,
  `idcentro` int(11) DEFAULT NULL,
  `nombreseccion` varchar(30) DEFAULT NULL,
  `idusuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`idseccion`),
  KEY `idcentro` (`idcentro`),
  KEY `idusuario` (`idusuario`),
  CONSTRAINT `Seccion_ibfk_1` FOREIGN KEY (`idcentro`) REFERENCES `CentroSalud` (`idcentro`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Seccion_ibfk_2` FOREIGN KEY (`idusuario`) REFERENCES `Usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Seccion`
--

LOCK TABLES `Seccion` WRITE;
/*!40000 ALTER TABLE `Seccion` DISABLE KEYS */;
INSERT INTO `Seccion` VALUES
(2,1,'consultas',14);
/*!40000 ALTER TABLE `Seccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Solicitud`
--

DROP TABLE IF EXISTS `Solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Solicitud` (
  `idsolicitud` int(11) NOT NULL AUTO_INCREMENT,
  `idusuario` int(11) DEFAULT NULL,
  `idseccion` int(11) DEFAULT NULL,
  `mensaje` varchar(300) DEFAULT NULL,
  `horasolicitud` datetime DEFAULT NULL,
  `estado` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`idsolicitud`),
  KEY `idusuario` (`idusuario`),
  KEY `idseccion` (`idseccion`),
  CONSTRAINT `Solicitud_ibfk_1` FOREIGN KEY (`idusuario`) REFERENCES `Usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Solicitud_ibfk_2` FOREIGN KEY (`idseccion`) REFERENCES `Seccion` (`idseccion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Solicitud`
--

LOCK TABLES `Solicitud` WRITE;
/*!40000 ALTER TABLE `Solicitud` DISABLE KEYS */;
INSERT INTO `Solicitud` VALUES
(10,10,2,'holi me duele el estomago',NULL,'pendiente'),
(12,13,2,'estoy lol ','2024-11-14 22:25:14','rechazado'),
(13,12,2,'a','2024-11-24 21:51:20','pendiente'),
(14,14,2,'aa','2024-11-24 21:53:47','pendiente'),
(15,14,2,'aaaa','2024-11-24 22:00:00','pendiente'),
(16,14,2,'dddd','2024-11-24 22:00:10','pendiente');
/*!40000 ALTER TABLE `Solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Usuario` (
  `idusuario` int(11) NOT NULL AUTO_INCREMENT,
  `rut` char(9) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `correoelectronico` varchar(75) DEFAULT NULL,
  `numerotelefono` char(9) DEFAULT NULL,
  `tipousuario` varchar(20) DEFAULT NULL,
  `contrasenia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idusuario`),
  KEY `rut` (`rut`),
  CONSTRAINT `Usuario_ibfk_1` FOREIGN KEY (`rut`) REFERENCES `Persona` (`rut`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES
(10,'456789123','Carlos','López','asdad@gmail.com',NULL,'suspendido','$2b$10$8ZTWqRYDY3ejQ56sGMYFy.L/h0Hss50MJ5RKtEV/JR0PX4S9VNz/.'),
(12,'123456789','Juan','Pérez','aaaa@g.com',NULL,'admin','$2b$10$1t0LnJIBxOXbey71hH9ZSemIrdelw9ERhC4zgI6yMEUJ76Oe06gpi'),
(13,'987654321','María','González','mariawa777@gmail.com','999888777','usuario','$2b$10$gsUN8hkIFEr3AJc37Wbize5bTmFuui5cPt47xLILHHm/ZaHzPOveW'),
(14,'321654987','Ana','Martínez','correorecep2@email.com','111222333','recepcionista','$2b$10$7/2UZcxvBIkAUBMr9ePyc.t7tTGWlMI04tufIA.vIdNIKlw3FIjH.');
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 20:45:55
