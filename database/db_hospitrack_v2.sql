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
  `IdCentro` int(11) NOT NULL AUTO_INCREMENT,
  `Latitud` varchar(20) DEFAULT NULL,
  `Longitud` varchar(20) DEFAULT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`IdCentro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CentroSalud`
--

LOCK TABLES `CentroSalud` WRITE;
/*!40000 ALTER TABLE `CentroSalud` DISABLE KEYS */;
/*!40000 ALTER TABLE `CentroSalud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EnEspera`
--

DROP TABLE IF EXISTS `EnEspera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EnEspera` (
  `IdRegistro` int(11) NOT NULL AUTO_INCREMENT,
  `RUT` char(9) DEFAULT NULL,
  `IdSeccion` int(11) DEFAULT NULL,
  `HoraRegistro` datetime DEFAULT NULL,
  `Prioridad` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`IdRegistro`),
  KEY `IdSeccion` (`IdSeccion`),
  KEY `RUT` (`RUT`),
  CONSTRAINT `EnEspera_ibfk_1` FOREIGN KEY (`IdSeccion`) REFERENCES `Seccion` (`IdSeccion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `EnEspera_ibfk_2` FOREIGN KEY (`RUT`) REFERENCES `Persona` (`RUT`) ON DELETE CASCADE ON UPDATE CASCADE
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
  `IdExpediente` int(11) NOT NULL AUTO_INCREMENT,
  `IdUsuario` int(11) DEFAULT NULL,
  `tratamiento` varchar(9) DEFAULT NULL,
  `diagnostico` varchar(300) DEFAULT NULL,
  `Hora` datetime DEFAULT NULL,
  `Estado` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`IdExpediente`),
  KEY `IdUsuario` (`IdUsuario`),
  CONSTRAINT `ExpedienteMedico_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`) ON DELETE CASCADE ON UPDATE CASCADE
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
-- Table structure for table `Persona`
--

DROP TABLE IF EXISTS `Persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Persona` (
  `RUT` char(9) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Apellido` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`RUT`)
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
  `IdReporte` int(11) NOT NULL AUTO_INCREMENT,
  `IdUsuario` int(11) DEFAULT NULL,
  `TipoReporte` varchar(50) DEFAULT NULL,
  `Mensaje` varchar(300) DEFAULT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  `fechareporte` datetime DEFAULT NULL,
  PRIMARY KEY (`IdReporte`),
  KEY `IdUsuario` (`IdUsuario`),
  CONSTRAINT `ReporteUsuario_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`) ON DELETE CASCADE ON UPDATE CASCADE
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
  `Idrespuesta` int(11) NOT NULL AUTO_INCREMENT,
  `IdSolicitud` int(11) DEFAULT NULL,
  `IdUsuario` int(11) DEFAULT NULL,
  `Mensaje` varchar(300) DEFAULT NULL,
  `Estado` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`Idrespuesta`),
  KEY `IdSolicitud` (`IdSolicitud`),
  KEY `IdUsuario` (`IdUsuario`),
  CONSTRAINT `RespuestaSolicitud_ibfk_1` FOREIGN KEY (`IdSolicitud`) REFERENCES `Solicitud` (`IdSolicitud`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RespuestaSolicitud_ibfk_2` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RespuestaSolicitud`
--

LOCK TABLES `RespuestaSolicitud` WRITE;
/*!40000 ALTER TABLE `RespuestaSolicitud` DISABLE KEYS */;
/*!40000 ALTER TABLE `RespuestaSolicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Seccion`
--

DROP TABLE IF EXISTS `Seccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Seccion` (
  `IdSeccion` int(11) NOT NULL AUTO_INCREMENT,
  `IdCentro` int(11) DEFAULT NULL,
  `NombreSeccion` varchar(30) DEFAULT NULL,
  `IdUsuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdSeccion`),
  KEY `IdCentro` (`IdCentro`),
  KEY `IdUsuario` (`IdUsuario`),
  CONSTRAINT `Seccion_ibfk_1` FOREIGN KEY (`IdCentro`) REFERENCES `CentroSalud` (`IdCentro`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Seccion_ibfk_2` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Seccion`
--

LOCK TABLES `Seccion` WRITE;
/*!40000 ALTER TABLE `Seccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `Seccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Solicitud`
--

DROP TABLE IF EXISTS `Solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Solicitud` (
  `IdSolicitud` int(11) NOT NULL AUTO_INCREMENT,
  `IdUsuario` int(11) DEFAULT NULL,
  `IdSeccion` int(11) DEFAULT NULL,
  `Mensaje` varchar(300) DEFAULT NULL,
  `HoraSolicitud` datetime DEFAULT NULL,
  `Estado` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`IdSolicitud`),
  KEY `IdUsuario` (`IdUsuario`),
  KEY `IdSeccion` (`IdSeccion`),
  CONSTRAINT `Solicitud_ibfk_1` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Solicitud_ibfk_2` FOREIGN KEY (`IdSeccion`) REFERENCES `Seccion` (`IdSeccion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Solicitud`
--

LOCK TABLES `Solicitud` WRITE;
/*!40000 ALTER TABLE `Solicitud` DISABLE KEYS */;
/*!40000 ALTER TABLE `Solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Usuario` (
  `IdUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `RUT` char(9) DEFAULT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `Apellido` varchar(50) DEFAULT NULL,
  `CorreoElectronico` varchar(75) DEFAULT NULL,
  `NumeroTelefono` char(9) DEFAULT NULL,
  `TipoUsuario` varchar(20) DEFAULT NULL,
  `Contrasenia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdUsuario`),
  KEY `RUT` (`RUT`),
  CONSTRAINT `Usuario_ibfk_1` FOREIGN KEY (`RUT`) REFERENCES `Persona` (`RUT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
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

-- Dump completed on 2024-10-01 17:54:11
