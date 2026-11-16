-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: HMS
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments_appointment`
--

DROP TABLE IF EXISTS `appointments_appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments_appointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `scheduled_at` datetime(6) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `clinic_id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  `token_number` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_appointment_doctor_id_fb58c3a1_fk_clinics_doctor_id` (`doctor_id`),
  KEY `appointments_appointment_patient_id_631d13da_fk_users_user_id` (`patient_id`),
  KEY `appointment_clinic__a48055_idx` (`clinic_id`,`scheduled_at`),
  CONSTRAINT `appointments_appointment_clinic_id_b4f8299f_fk_clinics_clinic_id` FOREIGN KEY (`clinic_id`) REFERENCES `clinics_clinic` (`id`),
  CONSTRAINT `appointments_appointment_doctor_id_fb58c3a1_fk_clinics_doctor_id` FOREIGN KEY (`doctor_id`) REFERENCES `clinics_doctor` (`id`),
  CONSTRAINT `appointments_appointment_patient_id_631d13da_fk_users_user_id` FOREIGN KEY (`patient_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments_appointment`
--

LOCK TABLES `appointments_appointment` WRITE;
/*!40000 ALTER TABLE `appointments_appointment` DISABLE KEYS */;
INSERT INTO `appointments_appointment` VALUES (10,'2026-09-22 19:52:00.000000','COMPLETED','','2026-09-23 06:52:25.393647',2,5,15,1),(11,'2026-09-22 20:53:00.000000','COMPLETED','','2026-09-23 06:53:44.221425',2,5,15,2),(12,'2026-09-24 07:24:00.000000','BOOKED','','2026-09-23 07:24:21.791727',2,5,15,1),(13,'2026-09-23 09:21:00.000000','BOOKED','','2026-09-23 09:21:34.045000',2,5,15,1);
/*!40000 ALTER TABLE `appointments_appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Blacklisted Token',6,'add_blacklistedtoken'),(22,'Can change Blacklisted Token',6,'change_blacklistedtoken'),(23,'Can delete Blacklisted Token',6,'delete_blacklistedtoken'),(24,'Can view Blacklisted Token',6,'view_blacklistedtoken'),(25,'Can add Outstanding Token',7,'add_outstandingtoken'),(26,'Can change Outstanding Token',7,'change_outstandingtoken'),(27,'Can delete Outstanding Token',7,'delete_outstandingtoken'),(28,'Can view Outstanding Token',7,'view_outstandingtoken'),(29,'Can add user',8,'add_user'),(30,'Can change user',8,'change_user'),(31,'Can delete user',8,'delete_user'),(32,'Can view user',8,'view_user'),(33,'Can add clinic',9,'add_clinic'),(34,'Can change clinic',9,'change_clinic'),(35,'Can delete clinic',9,'delete_clinic'),(36,'Can view clinic',9,'view_clinic'),(37,'Can add doctor',10,'add_doctor'),(38,'Can change doctor',10,'change_doctor'),(39,'Can delete doctor',10,'delete_doctor'),(40,'Can view doctor',10,'view_doctor'),(41,'Can add appointment',11,'add_appointment'),(42,'Can change appointment',11,'change_appointment'),(43,'Can delete appointment',11,'delete_appointment'),(44,'Can view appointment',11,'view_appointment'),(45,'Can add consultation',12,'add_consultation'),(46,'Can change consultation',12,'change_consultation'),(47,'Can delete consultation',12,'delete_consultation'),(48,'Can view consultation',12,'view_consultation'),(49,'Can add external lab',13,'add_externallab'),(50,'Can change external lab',13,'change_externallab'),(51,'Can delete external lab',13,'delete_externallab'),(52,'Can view external lab',13,'view_externallab'),(53,'Can add digital invoice',14,'add_digitalinvoice'),(54,'Can change digital invoice',14,'change_digitalinvoice'),(55,'Can delete digital invoice',14,'delete_digitalinvoice'),(56,'Can view digital invoice',14,'view_digitalinvoice');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinics_clinic`
--

DROP TABLE IF EXISTS `clinics_clinic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinics_clinic` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timezone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `discount_percent` decimal(5,2) NOT NULL,
  `sms_enabled` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinics_clinic`
--

LOCK TABLES `clinics_clinic` WRITE;
/*!40000 ALTER TABLE `clinics_clinic` DISABLE KEYS */;
INSERT INTO `clinics_clinic` VALUES (2,'malaika clinic','','pattoki','03180640486','UTC',1,0.00,0,'2026-09-23 06:23:56.539083');
/*!40000 ALTER TABLE `clinics_clinic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinics_doctor`
--

DROP TABLE IF EXISTS `clinics_doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinics_doctor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `specialty` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `consultation_fee` decimal(10,2) NOT NULL,
  `schedule` json NOT NULL,
  `is_available` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `clinic_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_number` (`registration_number`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `clinics_doctor_clinic_id_2ab40d3e_fk_clinics_clinic_id` (`clinic_id`),
  CONSTRAINT `clinics_doctor_clinic_id_2ab40d3e_fk_clinics_clinic_id` FOREIGN KEY (`clinic_id`) REFERENCES `clinics_clinic` (`id`),
  CONSTRAINT `clinics_doctor_user_id_af27e06d_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinics_doctor`
--

LOCK TABLES `clinics_doctor` WRITE;
/*!40000 ALTER TABLE `clinics_doctor` DISABLE KEYS */;
INSERT INTO `clinics_doctor` VALUES (5,'dentist','123',2000.00,'{\"days\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Saturday\", \"Sunday\"], \"end_time\": \"11:44\", \"start_time\": \"11:47\"}',1,'2026-09-23 06:48:22.809150',2,14);
/*!40000 ALTER TABLE `clinics_doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultations_consultation`
--

DROP TABLE IF EXISTS `consultations_consultation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultations_consultation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `vitals` json NOT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `prescription` json NOT NULL,
  `lab_ordered` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `appointment_id` bigint NOT NULL,
  `clinic_id` bigint NOT NULL,
  `lab_test_details` longtext COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (_utf8mb4''),
  `diagnosis` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointment_id` (`appointment_id`),
  KEY `consultatio_clinic__868b90_idx` (`clinic_id`,`created_at`),
  CONSTRAINT `consultations_consul_appointment_id_96c76110_fk_appointme` FOREIGN KEY (`appointment_id`) REFERENCES `appointments_appointment` (`id`),
  CONSTRAINT `consultations_consul_clinic_id_0742a0d6_fk_clinics_c` FOREIGN KEY (`clinic_id`) REFERENCES `clinics_clinic` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultations_consultation`
--

LOCK TABLES `consultations_consultation` WRITE;
/*!40000 ALTER TABLE `consultations_consultation` DISABLE KEYS */;
INSERT INTO `consultations_consultation` VALUES (5,'{\"bp\": \"120\"}','','\"[]deterfer\"',1,'2026-09-23 06:59:30.191841',10,2,'x ray',''),(6,'{}','','[]',0,'2026-09-23 07:24:39.196198',12,2,'','');
/*!40000 ALTER TABLE `consultations_consultation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(11,'appointments','appointment'),(3,'auth','group'),(2,'auth','permission'),(9,'clinics','clinic'),(10,'clinics','doctor'),(12,'consultations','consultation'),(4,'contenttypes','contenttype'),(14,'invoices','digitalinvoice'),(13,'labs','externallab'),(5,'sessions','session'),(6,'token_blacklist','blacklistedtoken'),(7,'token_blacklist','outstandingtoken'),(8,'users','user');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'clinics','0001_initial','2026-09-11 07:54:40.142158'),(2,'contenttypes','0001_initial','2026-09-11 07:54:40.242418'),(3,'contenttypes','0002_remove_content_type_name','2026-09-11 07:54:40.360113'),(4,'auth','0001_initial','2026-09-11 07:54:40.710167'),(5,'auth','0002_alter_permission_name_max_length','2026-09-11 07:54:40.810511'),(6,'auth','0003_alter_user_email_max_length','2026-09-11 07:54:40.828342'),(7,'auth','0004_alter_user_username_opts','2026-09-11 07:54:40.839169'),(8,'auth','0005_alter_user_last_login_null','2026-09-11 07:54:40.849815'),(9,'auth','0006_require_contenttypes_0002','2026-09-11 07:54:40.852052'),(10,'auth','0007_alter_validators_add_error_messages','2026-09-11 07:54:40.859862'),(11,'auth','0008_alter_user_username_max_length','2026-09-11 07:54:40.867110'),(12,'auth','0009_alter_user_last_name_max_length','2026-09-11 07:54:40.875159'),(13,'auth','0010_alter_group_name_max_length','2026-09-11 07:54:40.891858'),(14,'auth','0011_update_proxy_permissions','2026-09-11 07:54:40.900818'),(15,'auth','0012_alter_user_first_name_max_length','2026-09-11 07:54:40.908422'),(16,'users','0001_initial','2026-09-11 07:54:41.325864'),(17,'admin','0001_initial','2026-09-11 07:54:41.481361'),(18,'admin','0002_logentry_remove_auto_add','2026-09-11 07:54:41.493005'),(19,'admin','0003_logentry_add_action_flag_choices','2026-09-11 07:54:41.502432'),(20,'appointments','0001_initial','2026-09-11 07:54:41.527363'),(21,'appointments','0002_initial','2026-09-11 07:54:41.660557'),(22,'appointments','0003_initial','2026-09-11 07:54:41.776610'),(23,'clinics','0002_initial','2026-09-11 07:54:41.859385'),(24,'consultations','0001_initial','2026-09-11 07:54:42.060174'),(25,'invoices','0001_initial','2026-09-11 07:54:42.292734'),(26,'labs','0001_initial','2026-09-11 07:54:42.642754'),(27,'labs','0002_initial','2026-09-11 07:54:42.879408'),(28,'sessions','0001_initial','2026-09-11 07:54:42.952129'),(29,'token_blacklist','0001_initial','2026-09-11 07:54:43.351712'),(30,'token_blacklist','0002_outstandingtoken_jti_hex','2026-09-11 07:54:43.453139'),(31,'token_blacklist','0003_auto_20171017_2007','2026-09-11 07:54:43.531538'),(32,'token_blacklist','0004_auto_20171017_2013','2026-09-11 07:54:43.652213'),(33,'token_blacklist','0005_remove_outstandingtoken_jti','2026-09-11 07:54:43.782283'),(34,'token_blacklist','0006_auto_20171017_2113','2026-09-11 07:54:43.823402'),(35,'token_blacklist','0007_auto_20171017_2214','2026-09-11 07:54:44.204301'),(36,'token_blacklist','0008_migrate_to_bigautofield','2026-09-11 07:54:44.619115'),(37,'token_blacklist','0010_fix_migrate_to_bigautofield','2026-09-11 07:54:44.651728'),(38,'token_blacklist','0011_linearizes_history','2026-09-11 07:54:44.651728'),(39,'token_blacklist','0012_alter_outstandingtoken_user','2026-09-11 07:54:44.675462'),(40,'token_blacklist','0013_alter_blacklistedtoken_options_and_more','2026-09-11 07:54:44.702421'),(41,'appointments','0004_appointment_token_number','2026-09-14 07:23:38.389464'),(42,'labs','0003_externallab_report_file_alter_externallab_file_url','2026-09-14 07:23:38.652012'),(43,'consultations','0002_consultation_lab_test_details','2026-09-14 08:14:41.136288'),(44,'consultations','0003_consultation_diagnosis','2026-09-23 07:44:50.578831');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices_digitalinvoice`
--

DROP TABLE IF EXISTS `invoices_digitalinvoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices_digitalinvoice` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `line_items` json NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `pdf_url` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_via_sms` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `clinic_id` bigint NOT NULL,
  `consultation_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consultation_id` (`consultation_id`),
  KEY `invoices_di_clinic__bd1a1c_idx` (`clinic_id`,`created_at`),
  CONSTRAINT `invoices_digitalinvo_consultation_id_e2202a19_fk_consultat` FOREIGN KEY (`consultation_id`) REFERENCES `consultations_consultation` (`id`),
  CONSTRAINT `invoices_digitalinvoice_clinic_id_b5d7201e_fk_clinics_clinic_id` FOREIGN KEY (`clinic_id`) REFERENCES `clinics_clinic` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices_digitalinvoice`
--

LOCK TABLES `invoices_digitalinvoice` WRITE;
/*!40000 ALTER TABLE `invoices_digitalinvoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices_digitalinvoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labs_externallab`
--

DROP TABLE IF EXISTS `labs_externallab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labs_externallab` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_url` longtext COLLATE utf8mb4_unicode_ci,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `is_viewed` tinyint(1) NOT NULL,
  `clinic_id` bigint NOT NULL,
  `consultation_id` bigint DEFAULT NULL,
  `patient_id` bigint NOT NULL,
  `report_file` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `labs_externallab_consultation_id_c1e420db_fk_consultat` (`consultation_id`),
  KEY `labs_externallab_patient_id_47d79d1b_fk_users_user_id` (`patient_id`),
  KEY `labs_extern_clinic__29b283_idx` (`clinic_id`,`patient_id`),
  CONSTRAINT `labs_externallab_clinic_id_20e88b9b_fk_clinics_clinic_id` FOREIGN KEY (`clinic_id`) REFERENCES `clinics_clinic` (`id`),
  CONSTRAINT `labs_externallab_consultation_id_c1e420db_fk_consultat` FOREIGN KEY (`consultation_id`) REFERENCES `consultations_consultation` (`id`),
  CONSTRAINT `labs_externallab_patient_id_47d79d1b_fk_users_user_id` FOREIGN KEY (`patient_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labs_externallab`
--

LOCK TABLES `labs_externallab` WRITE;
/*!40000 ALTER TABLE `labs_externallab` DISABLE KEYS */;
INSERT INTO `labs_externallab` VALUES (2,NULL,'WhatsApp Image 2026-06-17 at 8.16.44 AM.jpeg','2026-09-23 07:04:34.370466',0,2,NULL,15,'lab_reports/WhatsApp_Image_2026-06-17_at_8.16.44_AM.jpeg');
/*!40000 ALTER TABLE `labs_externallab` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_blacklistedtoken` VALUES (1,'2026-09-11 08:11:32.549486',1),(2,'2026-09-11 08:38:06.832248',6),(3,'2026-09-11 10:19:58.273249',7),(8,'2026-09-12 06:46:14.319566',12),(9,'2026-09-12 07:01:31.311486',16),(10,'2026-09-12 07:02:49.685747',17),(11,'2026-09-12 07:03:32.926683',18),(12,'2026-09-12 07:44:57.441382',19),(14,'2026-09-12 08:07:41.262248',22),(15,'2026-09-12 08:14:51.532793',23),(16,'2026-09-14 06:55:27.939831',24),(17,'2026-09-14 07:10:50.009599',27),(18,'2026-09-14 07:12:24.603784',28),(19,'2026-09-14 07:15:15.135691',29),(20,'2026-09-14 07:16:30.082103',32),(21,'2026-09-14 07:31:09.835025',35),(22,'2026-09-14 07:31:39.658736',36),(23,'2026-09-14 07:52:36.359650',39),(24,'2026-09-14 07:54:29.753032',41),(25,'2026-09-14 07:59:59.557877',44),(26,'2026-09-14 08:26:23.638257',45),(27,'2026-09-14 08:30:19.732851',48),(28,'2026-09-14 08:32:32.682987',49),(29,'2026-09-14 08:42:53.635606',51),(30,'2026-09-14 08:58:36.547313',52),(31,'2026-09-14 08:59:48.375694',53),(32,'2026-09-14 09:00:42.317755',54),(33,'2026-09-14 09:07:09.942210',56),(34,'2026-09-23 06:18:29.368936',60),(35,'2026-09-23 06:29:56.366287',62),(36,'2026-09-23 06:48:32.864619',63),(37,'2026-09-23 06:51:35.839454',65),(38,'2026-09-23 06:52:38.185591',66),(39,'2026-09-23 06:53:48.298529',68),(40,'2026-09-23 07:02:11.969362',69),(41,'2026-09-23 07:04:53.266497',70),(42,'2026-09-23 07:24:25.450747',72),(43,'2026-09-23 07:27:07.787580',73),(44,'2026-09-23 07:49:16.353198',74),(45,'2026-09-23 07:57:01.061395',75),(46,'2026-09-23 08:21:09.711404',76),(47,'2026-09-23 09:15:20.451986',77),(50,'2026-09-23 09:20:56.154206',81),(51,'2026-09-23 09:22:00.242807',82),(52,'2026-09-24 04:13:57.421107',83);
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `jti` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_users_use` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_users_use` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_outstandingtoken` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcxOTA3OSwiaWF0IjoxNzg5MTE0Mjc5LCJqdGkiOiI2NTg2NjJmYmE0MWM0ZDQ5ODFmNWNjYjNiMzE1ZGNkNyIsInVzZXJfaWQiOiIxIn0.1nwu5X0Iex6zDwUcaHEnzzMIO4xcfrthrJKT25UXZCw','2026-09-11 08:11:19.599818','2026-09-18 08:11:19.000000',1,'658662fba41c4d4981f5ccb3b315dcd7'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcxOTA5MiwiaWF0IjoxNzg5MTE0MjkyLCJqdGkiOiI5OGQzZTBkNjhkNDU0MDM1OWFmMjQ4MTIwNTg4MjIwOSIsInVzZXJfaWQiOiIxIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiY2xpbmljX2lkIjpudWxsLCJuYW1lIjoiU3VwZXIgQWRtaW4ifQ.vo00PSmYZuJ-5bPLzXfTnvk4hLn6lqJO9fBxww01bHk','2026-09-11 08:11:32.531035','2026-09-18 08:11:32.000000',1,'98d3e0d68d4540359af2481205882209'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcxOTEwMiwiaWF0IjoxNzg5MTE0MzAyLCJqdGkiOiI1MTM4OWY3MGM3MmM0MjdiYjY0NzFkZDJlODAyZTg4MSIsInVzZXJfaWQiOiIxIn0.CtT46BVmqvGDdRe4SVMoJsMRP9ct0JgGtIxQTplOSeA','2026-09-11 08:11:42.316725','2026-09-18 08:11:42.000000',1,'51389f70c72c427bb6471dd2e802e881'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcxOTE5NCwiaWF0IjoxNzg5MTE0Mzk0LCJqdGkiOiJjNDY3YWIxZDUzZWY0MWY5ODBhOWY4MzY0MzFiOGZiNyIsInVzZXJfaWQiOiIxIn0.aSv8YdG4qA9UPpAogvJM5wX5XKBI_4nbV39_TDatT84','2026-09-11 08:13:14.414971','2026-09-18 08:13:14.000000',1,'c467ab1d53ef41f980a9f836431b8fb7'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcxOTIyMiwiaWF0IjoxNzg5MTE0NDIyLCJqdGkiOiJjNzk2MWFmYjlkYzU0MWVmOTU0YmY2NzEyOTgzZWU1OSIsInVzZXJfaWQiOiIxIn0.9-nVFkjXKj1DxWsuE-44XVBaGD9YpIoVAwqghvvaIf8','2026-09-11 08:13:42.386224','2026-09-18 08:13:42.000000',1,'c7961afb9dc541ef954bf6712983ee59'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcyMDUyOSwiaWF0IjoxNzg5MTE1NzI5LCJqdGkiOiI3YjZiNGRjMzc4ZWY0OTMxYjAxZDI5MDRlMzI1MjJkMiIsInVzZXJfaWQiOiIxIn0.Lre7Q-sPixxnb-jrEJiE9jmXwgVT8zSGY3ca0LJX0-I','2026-09-11 08:35:29.013030','2026-09-18 08:35:29.000000',1,'7b6b4dc378ef4931b01d2904e32522d2'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcyMDY5NywiaWF0IjoxNzg5MTE1ODk3LCJqdGkiOiJlZDA0MTlmOWNiODc0ZWE5OWIyYzc3MjEzNzFhY2RhYiIsInVzZXJfaWQiOiIyIn0.x0N7kQnvADdhIvDPAQ8no6nNa8DOx79Sp_YIFIaulJk','2026-09-11 08:38:17.207893','2026-09-18 08:38:17.000000',NULL,'ed0419f9cb874ea99b2c7721371acdab'),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcyNjc5OCwiaWF0IjoxNzg5MTIxOTk4LCJqdGkiOiI1YTE4OTE1OGU0OTM0NGIzOGIwN2Q5YWM0ODg4MjY1OCIsInVzZXJfaWQiOiIyIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImNsaW5pY19pZCI6MSwibmFtZSI6IkRyLk1hbGFpa2EifQ.et9rUd3D1_stw2XPk3anCL2fOl7YLrjW3JZPzkrGeQY','2026-09-11 10:19:58.133615','2026-09-18 10:19:58.000000',NULL,'5a189158e49344b38b07d9ac48882658'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcyNjc5OCwiaWF0IjoxNzg5MTIxOTk4LCJqdGkiOiJjYjBjNDUwMzYxY2M0YzI0ODdiZmY4ODEzZWQ5NzI0MiIsInVzZXJfaWQiOiIyIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImNsaW5pY19pZCI6MSwibmFtZSI6IkRyLk1hbGFpa2EifQ.rOHmBnnv23Wax8XHP5l2ytm1kHEfsD3xO11iid41O30','2026-09-11 10:19:58.190538','2026-09-18 10:19:58.000000',NULL,'cb0c450361cc4c2487bff8813ed97242'),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcyNjc5OCwiaWF0IjoxNzg5MTIxOTk4LCJqdGkiOiI0Mzg1ZjNmNGRiMDY0ZTc3YmQzZWZlNDQxNGFlODk0MCIsInVzZXJfaWQiOiIyIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImNsaW5pY19pZCI6MSwibmFtZSI6IkRyLk1hbGFpa2EifQ.Pvzfqbz7FacKDLBlk4W67bRDnBGvbqN4I3oFHIOSSgc','2026-09-11 10:19:58.146671','2026-09-18 10:19:58.000000',NULL,'4385f3f4db064e77bd3efe4414ae8940'),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcyNjgzNiwiaWF0IjoxNzg5MTIyMDM2LCJqdGkiOiIyMGUyMDg2ZmNkMmY0NmJiYWZiYzZlYzBhMjk4MmJkYSIsInVzZXJfaWQiOiIxIn0.6TvxOTkEaRTukzyVylZl3FK9jR6NkW-BIuvF5_C5I3o','2026-09-11 10:20:36.507113','2026-09-18 10:20:36.000000',1,'20e2086fcd2f46bbafbc6ec0a2982bda'),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTcyNjg3OSwiaWF0IjoxNzg5MTIyMDc5LCJqdGkiOiJjMmY5NjA4MDNkMWQ0YzA0OGY4Y2E5YmU2MjhkYzM5MCIsInVzZXJfaWQiOiIyIn0.BqXqva3nGTV09tLj23r2JJym_OU6SQyNPOSHVs52RKE','2026-09-11 10:21:19.502387','2026-09-18 10:21:19.000000',NULL,'c2f960803d1d4c048f8ca9be628dc390'),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMDM3NCwiaWF0IjoxNzg5MTk1NTc0LCJqdGkiOiI4ZmYwZmIwNDhkZmU0M2JmYmQ2ODJhNzM4NTI4ZTY4NSIsInVzZXJfaWQiOiIyIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImNsaW5pY19pZCI6MSwibmFtZSI6IkRyLk1hbGFpa2EifQ.L-1SgdLVsAI3bV8oXh7dbaJ0jtVXcUiYgwreAwboTYE','2026-09-12 06:46:14.179769','2026-09-19 06:46:14.000000',NULL,'8ff0fb048dfe43bfbd682a738528e685'),(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMDM3NCwiaWF0IjoxNzg5MTk1NTc0LCJqdGkiOiIxZTUwMWU0OTllZWQ0ZjhkODY2M2E0NWVhZTg5YmYwOCIsInVzZXJfaWQiOiIyIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImNsaW5pY19pZCI6MSwibmFtZSI6IkRyLk1hbGFpa2EifQ.HSRbcKkPiW1b13nhuz8-hr6hdHKydaSm1cnTYLv6FSw','2026-09-12 06:46:14.196684','2026-09-19 06:46:14.000000',NULL,'1e501e499eed4f8d8663a45eae89bf08'),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMDM3NCwiaWF0IjoxNzg5MTk1NTc0LCJqdGkiOiIwNGI5ZGRlYThiZGU0M2ZlOTY2OWQ1MDMxMTA3YmVhYiIsInVzZXJfaWQiOiIyIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImNsaW5pY19pZCI6MSwibmFtZSI6IkRyLk1hbGFpa2EifQ.zCweWGjGYeqHNYnjpTUI8k_VH2V3Fe1Bgu-1krjtzGo','2026-09-12 06:46:14.196684','2026-09-19 06:46:14.000000',NULL,'04b9ddea8bde43fe9669d5031107beab'),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMDcxMCwiaWF0IjoxNzg5MTk1OTEwLCJqdGkiOiJkNTI1N2YxZDVkMmU0NGIyODAwMWQwMGI0OGM1MGEzNyIsInVzZXJfaWQiOiI3In0.h73k3OqUwFsY0Z2idTTIXJsXps0dghw1Upe0MS7lznc','2026-09-12 06:51:50.101857','2026-09-19 06:51:50.000000',NULL,'d5257f1d5d2e44b28001d00b48c50a37'),(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMTMwMSwiaWF0IjoxNzg5MTk2NTAxLCJqdGkiOiJkNzM2YTk2NmM0NmM0ODVmOTVmMDY1M2VmMWIyZjJlNCIsInVzZXJfaWQiOiIyIn0.xgMRXtfp_O64l4ec3rfSZwbrzAHgSWnvrkxfXEChp10','2026-09-12 07:01:41.038205','2026-09-19 07:01:41.000000',NULL,'d736a966c46c485f95f0653ef1b2f2e4'),(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMTM5MywiaWF0IjoxNzg5MTk2NTkzLCJqdGkiOiJmMzBmMGU3ODhlN2Y0MWJmODQxODgxODRiNmI0OTUzMCIsInVzZXJfaWQiOiI4In0.hlLHWrCpLv1Dp7khpSDBpRQKLtxxcQwFsp3sHbJqnOg','2026-09-12 07:03:13.467124','2026-09-19 07:03:13.000000',NULL,'f30f0e788e7f41bf84188184b6b49530'),(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMTQyMSwiaWF0IjoxNzg5MTk2NjIxLCJqdGkiOiI5ZTFmNjdkNzg2ODA0NzRhODQzMmQ3OTMyMmZjZWI0MSIsInVzZXJfaWQiOiIyIn0.e_J7UEHXgJeBIiQe4NWfCNGEN08SnKQZ6XTKovSqfa4','2026-09-12 07:03:41.092717','2026-09-19 07:03:41.000000',NULL,'9e1f67d78680474a8432d79322fceb41'),(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMzg5NywiaWF0IjoxNzg5MTk5MDk3LCJqdGkiOiIzYTkyZmE5YTEzYzg0MTEyYjczYzZjMDdkMDEzNDdlMCIsInVzZXJfaWQiOiIyIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImNsaW5pY19pZCI6MSwibmFtZSI6IkRyLk1hbGFpa2EifQ.DB-0ET4Z-kseW9czURiLB9NUaqdKvV7GKSQjrkmUJts','2026-09-12 07:44:57.370202','2026-09-19 07:44:57.000000',NULL,'3a92fa9a13c84112b73c6c07d01347e0'),(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwMzg5NywiaWF0IjoxNzg5MTk5MDk3LCJqdGkiOiI3ZTJjMzk3OGI5ZDc0YjQ1OTcyMWJkOWJlMTUwODc4ZSIsInVzZXJfaWQiOiIyIiwicm9sZSI6IkNMSU5JQ19BRE1JTiIsImNsaW5pY19pZCI6MSwibmFtZSI6IkRyLk1hbGFpa2EifQ.wvO_4QVlxzCPrwziQFKfFRRKttdfb2K2bAQnjgNsSAo','2026-09-12 07:44:57.413920','2026-09-19 07:44:57.000000',NULL,'7e2c3978b9d74b459721bd9be150878e'),(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwNTE0NiwiaWF0IjoxNzg5MjAwMzQ2LCJqdGkiOiIyOWE1M2VkZjEyOTI0NTVmYjVhMDM4NjhhNjk3YzU4OSIsInVzZXJfaWQiOiIxIn0.17zTFLR9czdeSkYDiFWpdZKSlpkhjGzysNPvSdf9Z4I','2026-09-12 08:05:46.252333','2026-09-19 08:05:46.000000',1,'29a53edf1292455fb5a03868a697c589'),(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwNTI4MSwiaWF0IjoxNzg5MjAwNDgxLCJqdGkiOiIwMzY3NGVjMTNhM2Q0YTdiYTdhZjY5MTk3OTk4YTQwOSIsInVzZXJfaWQiOiIyIn0.Sw_-KdwnI5QTAoOPUWmur6ME_TCcK3oayhDj-sLjXno','2026-09-12 08:08:01.193843','2026-09-19 08:08:01.000000',NULL,'03674ec13a3d4a7ba7af69197998a409'),(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTgwNTcxOCwiaWF0IjoxNzg5MjAwOTE4LCJqdGkiOiI0ODAxNmQ3YjU1M2M0ZDk2OWJjZGM2ZjkxNDViNjgwNiIsInVzZXJfaWQiOiI4In0.uckbQoPxeqtctRK0kP4lAojW9z4asxSywCurlDrgrm8','2026-09-12 08:15:18.006871','2026-09-19 08:15:18.000000',NULL,'48016d7b553c4d969bcdc6f9145b6806'),(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3MzcyNywiaWF0IjoxNzg5MzY4OTI3LCJqdGkiOiI3M2Y0ZjFmMjI4ZjI0ODNjOGFkMmQ5N2IwZTM1YjVjNSIsInVzZXJfaWQiOiI4Iiwicm9sZSI6IlBBVElFTlQiLCJjbGluaWNfaWQiOjEsIm5hbWUiOiJtaWthIn0.qZKnMBgkVe6dozdwzbjZdlkhV94BOZRZ3qxZakCM8qY','2026-09-14 06:55:27.908933','2026-09-21 06:55:27.000000',NULL,'73f4f1f228f2483c8ad2d97b0e35b5c5'),(26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3Mzg2NiwiaWF0IjoxNzg5MzY5MDY2LCJqdGkiOiJhZTA1MWZhMDhhMTg0OWE3OWUwYjczN2Q5YTMxYTExYSIsInVzZXJfaWQiOiIxIn0.xhmKrQWpGLqhTRP86-T7GhFG7Mq4BZIWEU6j0CDumP0','2026-09-14 06:57:46.233132','2026-09-21 06:57:46.000000',1,'ae051fa08a1849a79e0b737d9a31a11a'),(27,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NDM1OSwiaWF0IjoxNzg5MzY5NTU5LCJqdGkiOiI4YmIxMDgxNGY3NzE0YzI1ODJjYjZkYWNhNWQ4ZDRhMSIsInVzZXJfaWQiOiIxIn0.JcmrYcozK-9Fwaz6yPupayYelW63pYu2thDKBgWIFgI','2026-09-14 07:05:59.699143','2026-09-21 07:05:59.000000',1,'8bb10814f7714c2582cb6daca5d8d4a1'),(28,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NDcxMCwiaWF0IjoxNzg5MzY5OTEwLCJqdGkiOiIyZmNjZmNmOTYxM2U0ZDE5YjU1MTVkOGEwM2M0ZDZjNSIsInVzZXJfaWQiOiIxIn0.9SKlnpNKFiUzdc62EhKI4TIclj7EBiAOTlEnvnYZkUw','2026-09-14 07:11:50.844338','2026-09-21 07:11:50.000000',1,'2fccfcf9613e4d19b5515d8a03c4d6c5'),(29,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NDc2MywiaWF0IjoxNzg5MzY5OTYzLCJqdGkiOiI5MWI0NGM1YmNmYjE0MTA1YTY5YTgxZWVhNWNjNDkzOSIsInVzZXJfaWQiOiIyIn0.R1bE2YfvC7-Ql4CqXzfAv5S0wp9XvsyBEIgfXoZs_Jk','2026-09-14 07:12:43.593180','2026-09-21 07:12:43.000000',NULL,'91b44c5bcfb14105a69a81eea5cc4939'),(30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NDg5MywiaWF0IjoxNzg5MzcwMDkzLCJqdGkiOiI1M2JlNWNmNTk5NDI0ZjlmODBjOWEyNjYwOWRjNDdiZCIsInVzZXJfaWQiOiIxIn0.VyPYF2v7KLxrbrt5YZ5AgqTRWa-pSnVIPYqmVEcJpms','2026-09-14 07:14:53.666494','2026-09-21 07:14:53.000000',1,'53be5cf599424f9f80c9a26609dc47bd'),(31,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NDkyNSwiaWF0IjoxNzg5MzcwMTI1LCJqdGkiOiI1MTYwODQwYzcxNDg0MmVmYTQzZDY0ZGMxYWMxODM1MSIsInVzZXJfaWQiOiI1In0.L4QGKHAiLk9xoNOEg_9fFZOU6Xo_oGMJbOUmMWZgyrY','2026-09-14 07:15:25.327489','2026-09-21 07:15:25.000000',NULL,'5160840c714842efa43d64dc1ac18351'),(32,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NDk0NywiaWF0IjoxNzg5MzcwMTQ3LCJqdGkiOiJhNGI1ZmM3ODhkNDc0NDA2OGQ5MTg0MGI0MjRmZjQ5NCIsInVzZXJfaWQiOiIyIn0.eqk578NqghCtfgCel6Ivkf4Kt9dO-PA2A1xv1DPljHc','2026-09-14 07:15:47.335991','2026-09-21 07:15:47.000000',NULL,'a4b5fc788d4744068d91840b424ff494'),(33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NDk5OSwiaWF0IjoxNzg5MzcwMTk5LCJqdGkiOiJlNGJmODE1MDZhYWI0ZTE3YjgyZDE3NTU2MjljNTBiMCIsInVzZXJfaWQiOiI1In0.eswtXlwiXYfiQyMJuV7dOCvQybz5orbZxdysuxybqcc','2026-09-14 07:16:39.844089','2026-09-21 07:16:39.000000',NULL,'e4bf81506aab4e17b82d1755629c50b0'),(34,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NTY3NiwiaWF0IjoxNzg5MzcwODc2LCJqdGkiOiI0ZDY0N2JlOTY0OGM0OWU5ODJmZDNhZDk1YjgzZTJkMiIsInVzZXJfaWQiOiI1In0.DVu3d9eGTRQjdSOne7oBppu1mjC_us3Muz61rqCUvlw','2026-09-14 07:27:56.510400','2026-09-21 07:27:56.000000',NULL,'4d647be9648c49e982fd3ad95b83e2d2'),(35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NTcwNiwiaWF0IjoxNzg5MzcwOTA2LCJqdGkiOiI5YWY2NGRkMTVhNjA0MjAwYTM2MWEwMzE1ZWRmYmMxOCIsInVzZXJfaWQiOiIyIn0.hsjgCn6y4PkYIMdSuVc3aARX41Ezut_WPlCB2iPxRKg','2026-09-14 07:28:26.501652','2026-09-21 07:28:26.000000',NULL,'9af64dd15a604200a361a0315edfbc18'),(36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NTg3OSwiaWF0IjoxNzg5MzcxMDc5LCJqdGkiOiJiOGJjN2Q1MDljMzI0NzEwOWJjMTA5NWU5MzM2MWM3MSIsInVzZXJfaWQiOiI3In0.vL-Ei7tlT1LvFM0cK65GjRhsN9cXb8XC69rB5Ky-4iw','2026-09-14 07:31:19.892658','2026-09-21 07:31:19.000000',NULL,'b8bc7d509c3247109bc1095e93361c71'),(37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NTkxMiwiaWF0IjoxNzg5MzcxMTEyLCJqdGkiOiI3ZWIwODE1NjFjZWY0MjU5ODQxNmQ4ZjcwMjQ3Y2VkZSIsInVzZXJfaWQiOiI1In0._3JlabOp7Er0uj4hQCfiSZU0YyutQcbiY4-75EdT3OM','2026-09-14 07:31:52.102229','2026-09-21 07:31:52.000000',NULL,'7eb081561cef42598416d8f70247cede'),(38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NzAzOSwiaWF0IjoxNzg5MzcyMjM5LCJqdGkiOiJkMDM2ODM1MjRiZTI0ZDgwYTM3OTFhOWU1M2M0ZGRjMSIsInVzZXJfaWQiOiI3In0.9rNEkn2Vc4YOL7atIs8KU_7O0tmKAjcuK4Xiol1eD7w','2026-09-14 07:50:39.705730','2026-09-21 07:50:39.000000',NULL,'d03683524be24d80a3791a9e53c4ddc1'),(39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NzEyNywiaWF0IjoxNzg5MzcyMzI3LCJqdGkiOiI3NDA2NDMxYTNmNDY0ZDdhYmEzOTNjMjg1N2ZmMjc1NiIsInVzZXJfaWQiOiIyIn0.X8FPpcg_ZPRCvQdrdIoAwNc3cW6_Q1b6MHHgB__-AkQ','2026-09-14 07:52:07.827755','2026-09-21 07:52:07.000000',NULL,'7406431a3f464d7aba393c2857ff2756'),(40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NzE3MSwiaWF0IjoxNzg5MzcyMzcxLCJqdGkiOiI5NGY1NDc4MjA0YjI0ZDc4YTcyZWEwZmUwMzQ0Y2M0YiIsInVzZXJfaWQiOiI4In0.0NvjoOPKn_8tzX_u9VaHoVtgUg4V4d6ZCJ7jDfyxXJk','2026-09-14 07:52:51.347245','2026-09-21 07:52:51.000000',NULL,'94f5478204b24d78a72ea0fe0344cc4b'),(41,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NzIyOCwiaWF0IjoxNzg5MzcyNDI4LCJqdGkiOiIzNGY4ODhhZGRlNjU0YTQ2OTk2ZWFlZDYyZTYwMDgxMSIsInVzZXJfaWQiOiI3In0.GLYRHsQpyAl5cPUM8VhW87lVPbs12dPNsXiJ9xL7CW8','2026-09-14 07:53:48.032108','2026-09-21 07:53:48.000000',NULL,'34f888adde654a46996eaed62e600811'),(42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NzI4MSwiaWF0IjoxNzg5MzcyNDgxLCJqdGkiOiJmYzdlYTYyYjUwNWY0NmM3YmRiMzQ3NjlmMzA3YjYyZCIsInVzZXJfaWQiOiI2In0.IIdiqrbGpNa5TfkmxXrDSL7QXU9SDIhV7Bvydp2lmHk','2026-09-14 07:54:41.407602','2026-09-21 07:54:41.000000',NULL,'fc7ea62b505f46c7bdb34769f307b62d'),(43,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NzUxNCwiaWF0IjoxNzg5MzcyNzE0LCJqdGkiOiIzNDk5ZmJhMmVmZjk0N2MxYjQ1ZDEzNWUzYjkxNGE3YyIsInVzZXJfaWQiOiI3In0.zbPtOGHbOrO9FMGSOCtLa0jV-uN1DkTOWA9_rQu2fQ0','2026-09-14 07:58:34.937822','2026-09-21 07:58:34.000000',NULL,'3499fba2eff947c1b45d135e3b914a7c'),(44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NzU4MSwiaWF0IjoxNzg5MzcyNzgxLCJqdGkiOiI0M2ViZThmNGVjZWI0ZmQwYmE1MjMxYjBlYTgxNWM0NyIsInVzZXJfaWQiOiI4In0.7iGUMq1bl6BNhrbtAA0hSnePgDjVEdS3vBinuc0RcDU','2026-09-14 07:59:41.175221','2026-09-21 07:59:41.000000',NULL,'43ebe8f4eceb4fd0ba5231b0ea815c47'),(45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3NzYyMiwiaWF0IjoxNzg5MzcyODIyLCJqdGkiOiJmYTZiYTExOTMzZGU0ODEyYmY2ZDc4YTMxZTc1OTQ5MyIsInVzZXJfaWQiOiI1In0.79MoF4uNquVkOtFp7fd0kBXi8YC-No89dUoGeT-KXQQ','2026-09-14 08:00:22.888204','2026-09-21 08:00:22.000000',NULL,'fa6ba11933de4812bf6d78a31e759493'),(46,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3OTE4MywiaWF0IjoxNzg5Mzc0MzgzLCJqdGkiOiJmMDI3MTIxZGUyYmE0MDkzODdlMDljMzMxODNlZDY0MCIsInVzZXJfaWQiOiI1Iiwicm9sZSI6IkRPQ1RPUiIsImNsaW5pY19pZCI6MSwibmFtZSI6ImhpcmEifQ.k_brKtLmnpQCnP3f9XtnEZw1bZYIjJ38QTRDzEyTBMY','2026-09-14 08:26:23.626813','2026-09-21 08:26:23.000000',NULL,'f027121de2ba409387e09c33183ed640'),(47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3OTE5NSwiaWF0IjoxNzg5Mzc0Mzk1LCJqdGkiOiIxNzg1MGY3MDAxMzE0ZjM2ODMwYTk3NzUwZGM1M2U3OSIsInVzZXJfaWQiOiI1In0.mGNCkNKi8-hhi8flB01ASQ9iDbeF6EQIYnCmz-fmED0','2026-09-14 08:26:35.046194','2026-09-21 08:26:35.000000',NULL,'17850f7001314f36830a97750dc53e79'),(48,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3OTMzMywiaWF0IjoxNzg5Mzc0NTMzLCJqdGkiOiJlNDdjZjc3ZTgzZWU0NTI0YjA4ZGY2N2Q4MGJjOTc4NyIsInVzZXJfaWQiOiI3In0.DZh307l-8mrMR4_djMhfpSVFssxZM86Pv0DYPoey5WI','2026-09-14 08:28:53.240480','2026-09-21 08:28:53.000000',NULL,'e47cf77e83ee4524b08df67d80bc9787'),(49,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3OTQyOSwiaWF0IjoxNzg5Mzc0NjI5LCJqdGkiOiJkZWJhOGEwM2E3NDc0YjM5ODAzYmRjZTNlYjE0M2Q0ZiIsInVzZXJfaWQiOiI1In0.YuZZIdyigRoXVFu6xDBkd2PZ2BFzMzQMTVKJR6apfsw','2026-09-14 08:30:29.503832','2026-09-21 08:30:29.000000',NULL,'deba8a03a7474b39803bdce3eb143d4f'),(50,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3OTU1MiwiaWF0IjoxNzg5Mzc0NzUyLCJqdGkiOiI3MjJhZGJjNTg3OGI0YzMwYjMyYzkwOWMxZDQxZjUwNCIsInVzZXJfaWQiOiI1Iiwicm9sZSI6IkRPQ1RPUiIsImNsaW5pY19pZCI6MSwibmFtZSI6ImhpcmEifQ.w1LWC-eGb8GtYYeybFm22xrz03Gz5gnyr56WPB9Xf50','2026-09-14 08:32:32.671163','2026-09-21 08:32:32.000000',NULL,'722adbc5878b4c30b32c909c1d41f504'),(51,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk3OTU3NCwiaWF0IjoxNzg5Mzc0Nzc0LCJqdGkiOiI1Mzk4NDUxZDI3N2I0MGQyYmNkYjdkNTY4N2RjZDc5NyIsInVzZXJfaWQiOiI3In0.NUOUMdU7PyDKUdB5L694phK61E-gGIjGhT5WGVBKxRA','2026-09-14 08:32:54.365997','2026-09-21 08:32:54.000000',NULL,'5398451d277b40d2bcdb7d5687dcd797'),(52,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk4MDIwNSwiaWF0IjoxNzg5Mzc1NDA1LCJqdGkiOiI3NDExOGQwOTg2NzU0Njk0OWNkN2FkYzYyNDMwMTkwMCIsInVzZXJfaWQiOiIyIn0.VCZ2psSHtI1LFlb_4N63eCuqbETvg0SAA9QNYqquzLY','2026-09-14 08:43:25.797287','2026-09-21 08:43:25.000000',NULL,'74118d09867546949cd7adc624301900'),(53,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk4MTE2MSwiaWF0IjoxNzg5Mzc2MzYxLCJqdGkiOiIxYTJhYWEyMDU1OWQ0OTgzYjkyZTkxMWRiZDE4ZDM3ZiIsInVzZXJfaWQiOiIyIn0.8vdC-VC35ql-ItuiAmdtsksDVjBmtp4ypmwaNHDnHcc','2026-09-14 08:59:21.229524','2026-09-21 08:59:21.000000',NULL,'1a2aaa20559d4983b92e911dbd18d37f'),(54,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk4MTIwOCwiaWF0IjoxNzg5Mzc2NDA4LCJqdGkiOiJiYzZmNjViZjQwOGU0ZjIyYmM2NDAwY2ExNDlkOTAwMyIsInVzZXJfaWQiOiI5In0.Hl5C8cnQ_LT29XEC74kBuvNJGYjgmaPSmI_vSiMTQ4A','2026-09-14 09:00:08.644227','2026-09-21 09:00:08.000000',NULL,'bc6f65bf408e4f22bc6400ca149d9003'),(55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk4MTI1NSwiaWF0IjoxNzg5Mzc2NDU1LCJqdGkiOiI3NDJkMjFkYTljMTU0OTczYjEyNjMwZjEwYjhjMDhmZiIsInVzZXJfaWQiOiI1In0.oXy9Q33qj5Yf-4qPN8sU_MMwz5gM96zgDaZd0R34ONw','2026-09-14 09:00:55.374554','2026-09-21 09:00:55.000000',NULL,'742d21da9c154973b12630f10b8c08ff'),(56,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk4MTM0MSwiaWF0IjoxNzg5Mzc2NTQxLCJqdGkiOiJkYWI3MzI1OGMwY2Y0ZDI3OGUwOTFjYjBmMmNlM2Y2NyIsInVzZXJfaWQiOiI5In0.8oMiM3n9mO_B2O_qGdtvODOEyiNcwEr_kcnxFPZK-e0','2026-09-14 09:02:21.734584','2026-09-21 09:02:21.000000',NULL,'dab73258c0cf4d278e091cb0f2ce3f67'),(57,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk4MTY1MCwiaWF0IjoxNzg5Mzc2ODUwLCJqdGkiOiJjMGRlZDhlODVhOTE0YjE5OWE1OTFkZDFmYWIyOWJhNCIsInVzZXJfaWQiOiI1In0.Yk_PCKPRnT6fbKb5Uy5M-IQfGMxKuw-DYHXm5-01e2g','2026-09-14 09:07:30.482735','2026-09-21 09:07:30.000000',NULL,'c0ded8e85a914b199a591dd1fab29ba4'),(58,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4OTk4MzQxNiwiaWF0IjoxNzg5Mzc4NjE2LCJqdGkiOiJjMmE3MDQyM2UyNGM0MmU3ODI4NGQ4ZTgyOGIwMDg1MyIsInVzZXJfaWQiOiIyIn0.vlXtotSQs_nWkQKvRJATgo6Mn4tm2fBp_XgqX2eGkC0','2026-09-14 09:36:56.886632','2026-09-21 09:36:56.000000',NULL,'c2a70423e24c42e78284d8e828b00853'),(59,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc0OTA0NSwiaWF0IjoxNzkwMTQ0MjQ1LCJqdGkiOiIxZTk5Y2ZkMWJhMmQ0NzlmOWM4MmY5MDI1ZWMyMjE4MiIsInVzZXJfaWQiOiIxMCJ9.WIptUT3PawvTinRyruQq_TbxOtdJTX9ts3Peuu_ILcU','2026-09-23 06:17:25.498744','2026-09-30 06:17:25.000000',NULL,'1e99cfd1ba2d479f9c82f9025ec22182'),(60,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc0OTA2NywiaWF0IjoxNzkwMTQ0MjY3LCJqdGkiOiJlMzM1YjExNDU2NjU0OTY3YjY3OTQ2YmU4MzdhNDdmYSIsInVzZXJfaWQiOiIxMCJ9._CcNuYbEjLOlQnKxgGO3hjjmMyv1VahKADUZjIqSHiE','2026-09-23 06:17:47.286993','2026-09-30 06:17:47.000000',NULL,'e335b11456654967b67946be837a47fa'),(61,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc0OTEwOSwiaWF0IjoxNzkwMTQ0MzA5LCJqdGkiOiJjYzllMzRkZTgwMTQ0YTZkOWVkNjI5YjAwOTA4MDFjYiIsInVzZXJfaWQiOiIxMCIsInJvbGUiOiIiLCJjbGluaWNfaWQiOm51bGwsIm5hbWUiOiJBZG1pbiBVc2VyIn0.cESsatC-o-vpD0n9WWCfXCPOo7mHDAlr_J7K3jMxfeE','2026-09-23 06:18:29.339250','2026-09-30 06:18:29.000000',NULL,'cc9e34de80144a6d9ed629b0090801cb'),(62,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc0OTE3MywiaWF0IjoxNzkwMTQ0MzczLCJqdGkiOiI4NzRlZDg0MGE3YWI0ODRiOTI0ZTU4N2ExMTYzNjFjZiIsInVzZXJfaWQiOiIxIn0.9JA094wGY1wuNGk-pCVq0b6TypnyhbDauCFBGryqJ24','2026-09-23 06:19:33.188410','2026-09-30 06:19:33.000000',1,'874ed840a7ab484b924e587a116361cf'),(63,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc0OTgwMiwiaWF0IjoxNzkwMTQ1MDAyLCJqdGkiOiJhNTg3NjU2MDJiMmY0ZjEyOWQyNWJiNmRlYTNiOGU4ZiIsInVzZXJfaWQiOiIxMSJ9.yoRxoab-M-OgBHSpuuUaqwx29nCWWFQY-hFU_Jt4uhU','2026-09-23 06:30:02.134717','2026-09-30 06:30:02.000000',11,'a58765602b2f4f129d25bb6dea3b8e8f'),(64,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MDkzMSwiaWF0IjoxNzkwMTQ2MTMxLCJqdGkiOiJiYjY1NmJiM2RlNjU0NzE1YThjNmViMjQ3YjA3NzlkMCIsInVzZXJfaWQiOiIxNCJ9.skq1rh8Kza13TycOWCltaPjdS1xwd0TD5PccDEUu74U','2026-09-23 06:48:51.419122','2026-09-30 06:48:51.000000',14,'bb656bb3de654715a8c6eb247b0779d0'),(65,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MTA2MCwiaWF0IjoxNzkwMTQ2MjYwLCJqdGkiOiIzYjIwODkyMjVjZGI0ZjU4ODFlY2RkZWNhYzdmN2ZhYyIsInVzZXJfaWQiOiIxMSJ9.TaX2M-UBhj0GIL0Ajpt5PQAVuVoEmpPzd_x5NETiM44','2026-09-23 06:51:00.680514','2026-09-30 06:51:00.000000',11,'3b2089225cdb4f5881ecddecac7f7fac'),(66,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MTExNywiaWF0IjoxNzkwMTQ2MzE3LCJqdGkiOiJmZjU5ODNhNjEzZjU0YjY3YmExNWEzNWFkOWNhYWZlYSIsInVzZXJfaWQiOiIxNSJ9.QCfXVrVxAJ0V6oyO0ldzknM6pEdwFN1Frqrbv77HZYg','2026-09-23 06:51:57.099895','2026-09-30 06:51:57.000000',15,'ff5983a613f54b67ba15a35ad9caafea'),(67,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MTE3MywiaWF0IjoxNzkwMTQ2MzczLCJqdGkiOiJlM2VhNzlmMDcyZmE0YzRmOWRjMDZkZTQwYzYwMWM5NiIsInVzZXJfaWQiOiIxNCJ9.rWVrhoD_UMADWib0YBEDPVXTBgZYdR_ZJC0meq-dQKw','2026-09-23 06:52:53.899366','2026-09-30 06:52:53.000000',14,'e3ea79f072fa4c4f9dc06de40c601c96'),(68,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MTIwNiwiaWF0IjoxNzkwMTQ2NDA2LCJqdGkiOiIzN2E5NmM4ZTEzZTc0Nzg1OTJhYzkxYzhjMTIxYmI0YiIsInVzZXJfaWQiOiIxNSJ9.r8Sa93alVOzaeDonff9hMMf_A3UnZXHGTuR9S0VeP4w','2026-09-23 06:53:26.192954','2026-09-30 06:53:26.000000',15,'37a96c8e13e7478592ac91c8c121bb4b'),(69,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MTIzOSwiaWF0IjoxNzkwMTQ2NDM5LCJqdGkiOiJmNWQ4MTU4YjBkN2Y0ZGQ0ODJlMmY0N2ZkMzYzNWFhNCIsInVzZXJfaWQiOiIxNCJ9.xxq98OfZ0DzsF-7eXWpV4lFFJCT_tMWgq4CiP7v7Cvw','2026-09-23 06:53:59.969281','2026-09-30 06:53:59.000000',14,'f5d8158b0d7f4dd482e2f47fd3635aa4'),(70,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MTg1NiwiaWF0IjoxNzkwMTQ3MDU2LCJqdGkiOiI1MDQyZmYzMWM0YmU0OWI2YjAxY2YyZDQ3OTI5NWI4NyIsInVzZXJfaWQiOiIxNSJ9.qu1lFUjNEdKOhIpKJ1yAnSpRqF6Y9yMAhFBQBVYdIjY','2026-09-23 07:04:16.464287','2026-09-30 07:04:16.000000',15,'5042ff31c4be49b6b01cf2d479295b87'),(71,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MjE5NCwiaWF0IjoxNzkwMTQ3Mzk0LCJqdGkiOiI4YzU2MTJkZDMxYTI0NzQ2OWRhODAwOWFhNjBjZTQzZiIsInVzZXJfaWQiOiIxNCJ9.1_I8Icbp-gLFDoA2GTV1wvMzMVRgQebLNPt6qDTTucE','2026-09-23 07:09:54.219777','2026-09-30 07:09:54.000000',14,'8c5612dd31a247469da8009aa60ce43f'),(72,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MzAyMywiaWF0IjoxNzkwMTQ4MjIzLCJqdGkiOiI4YzRhNTNmMjJmMDg0Njg4YWFiZTkxZGVkOWQwOTAzYyIsInVzZXJfaWQiOiIxNSJ9.pNR_SM7VWsMORdXgA6UriLY_FsDHGU7K3wW44hoxwww','2026-09-23 07:23:43.246672','2026-09-30 07:23:43.000000',15,'8c4a53f22f084688aabe91ded9d0903c'),(73,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MzA3NiwiaWF0IjoxNzkwMTQ4Mjc2LCJqdGkiOiI3Y2RjYmY4ODE0NWY0ZjUwODYzNzQ4ODlhYjkzMDZlMiIsInVzZXJfaWQiOiIxNCJ9.yG8t0fABBx1_nnTg1ji04mxWARLCWoj_OoWYpKa5NF0','2026-09-23 07:24:36.012034','2026-09-30 07:24:36.000000',14,'7cdcbf88145f4f5086374889ab9306e2'),(74,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1MzI1MCwiaWF0IjoxNzkwMTQ4NDUwLCJqdGkiOiI1NTJmZmQ3YmY0Njk0YzQyOGU0MGIyOTUwY2NjMTZmOCIsInVzZXJfaWQiOiIxNSJ9.UUGuRG2bLCJggx-BC5mWRaR7XQHz9YXRNY5YS-atFYA','2026-09-23 07:27:30.167428','2026-09-30 07:27:30.000000',15,'552ffd7bf4694c428e40b2950ccc16f8'),(75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1NDU3MCwiaWF0IjoxNzkwMTQ5NzcwLCJqdGkiOiI4NTM5MWMzYjg4Mjg0Y2FiYjMzMzg3MDM3Y2U0NmIyNSIsInVzZXJfaWQiOiIxMSJ9.Td7pXxXYIz9_VNPe5bLA9WrBYhwQCVfvOaANyO0KLAg','2026-09-23 07:49:30.165837','2026-09-30 07:49:30.000000',11,'85391c3b88284cabb33387037ce46b25'),(76,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1NTAzMSwiaWF0IjoxNzkwMTUwMjMxLCJqdGkiOiIwNjMyNWI4ZDdlYWY0NzgwYTIyYmFkMGFhMzY4NjBmZSIsInVzZXJfaWQiOiIxNSJ9.kdyzS08MtBlkjShXdBaH1ealfZ5rrHIrZ-AdP7oifnY','2026-09-23 07:57:11.510559','2026-09-30 07:57:11.000000',15,'06325b8d7eaf4780a22bad0aa36860fe'),(77,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1NjQ3OCwiaWF0IjoxNzkwMTUxNjc4LCJqdGkiOiIwOTk4MmIzY2EzZDY0MTNjYWY2YjIwMDIwYTJkOWI5OCIsInVzZXJfaWQiOiIxMSJ9.2smKzJy8QrjnieA9j1lFaj3AGtVAhlnzMFXsHprTsrI','2026-09-23 08:21:18.704845','2026-09-30 08:21:18.000000',11,'09982b3ca3d6413caf6b20020a2d9b98'),(78,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1OTcyMCwiaWF0IjoxNzkwMTU0OTIwLCJqdGkiOiI1N2JiNzQ5ZmY1ZmQ0ZjFkYjQ5N2I4YzhmYTQ1ZjY4MyIsInVzZXJfaWQiOiIxMSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJjbGluaWNfaWQiOjIsIm5hbWUiOiJtYWxhaWthIn0.0_3Qg1P45XCG8jEAvasNyBzEfTxCaZnwSqM7FtLRWBo','2026-09-23 09:15:20.428842','2026-09-30 09:15:20.000000',11,'57bb749ff5fd4f1db497b8c8fa45f683'),(79,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1OTcyMCwiaWF0IjoxNzkwMTU0OTIwLCJqdGkiOiJiMzk1M2I5ZGRlZTg0Njg3YjViNGI0M2NlNzQzYzY0OSIsInVzZXJfaWQiOiIxMSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJjbGluaWNfaWQiOjIsIm5hbWUiOiJtYWxhaWthIn0._m44tS_bBP9pLz4jQEjijEwcZA-WkFkpT9gFuD_HtqM','2026-09-23 09:15:20.436349','2026-09-30 09:15:20.000000',11,'b3953b9ddee84687b5b4b43ce743c649'),(80,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1OTcyMCwiaWF0IjoxNzkwMTU0OTIwLCJqdGkiOiI2MmNkZjM0NzYyMDQ0ZmZmODUyYmQ5NTFkNmNiODYyNCIsInVzZXJfaWQiOiIxMSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJjbGluaWNfaWQiOjIsIm5hbWUiOiJtYWxhaWthIn0.gc84SDMS8MW0XmeBgtrQilrE5OuJgKiRkIi7xAC763M','2026-09-23 09:15:20.436349','2026-09-30 09:15:20.000000',11,'62cdf34762044fff852bd951d6cb8624'),(81,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc1OTg4NywiaWF0IjoxNzkwMTU1MDg3LCJqdGkiOiI2NDkyNTVhM2YxNDg0NDVlYjFiYTBiMDZjNmVmZjFhNCIsInVzZXJfaWQiOiIxMSJ9.XSjpnwK7y50yrqitC4OpztRareK5RNucEeyuKxt-G78','2026-09-23 09:18:07.271614','2026-09-30 09:18:07.000000',11,'649255a3f148445eb1ba0b06c6eff1a4'),(82,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc2MDA2OSwiaWF0IjoxNzkwMTU1MjY5LCJqdGkiOiJkNzI0OGU2ZWI1OTA0OTU5YTE3NDE3OTRiYmU4YWNmMCIsInVzZXJfaWQiOiIxNSJ9.XZtx1HM_svlLqTL9qk8DL5AjiYBTXgLNqvh2TNLdcLE','2026-09-23 09:21:09.110798','2026-09-30 09:21:09.000000',15,'d7248e6eb5904959a1741794bbe8acf0'),(83,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDc2MDEyOSwiaWF0IjoxNzkwMTU1MzI5LCJqdGkiOiJhZjc0NzcwNTg1ZGU0ZDI4YjQxYjcxMTUzMzdkYjk4OSIsInVzZXJfaWQiOiIxMSJ9.IMa9If3Wwg5U4YNrOmnKvSAA3FNjrzzDu23Ltxakg7Y','2026-09-23 09:22:09.897643','2026-09-30 09:22:09.000000',11,'af74770585de4d28b41b7115337db989'),(84,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDgyODAzNywiaWF0IjoxNzkwMjIzMjM3LCJqdGkiOiJiNzg2NDIxOGUxNzM0YTAyYTQ4YzdmY2EzZGQyMzQyZCIsInVzZXJfaWQiOiIxMSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJjbGluaWNfaWQiOjIsIm5hbWUiOiJtYWxhaWthIn0.8TQnBAhALx6FP9zfKj3sbL0kI58VfkFQeULNqkiD-Eo','2026-09-24 04:13:57.327313','2026-10-01 04:13:57.000000',11,'b7864218e1734a02a48c7fca3dd2342d'),(85,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDgyODAzNywiaWF0IjoxNzkwMjIzMjM3LCJqdGkiOiJmMTA5NDA5NzYyY2I0MTUyYWQyM2ZhZWViZDdjN2MwOCIsInVzZXJfaWQiOiIxMSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJjbGluaWNfaWQiOjIsIm5hbWUiOiJtYWxhaWthIn0.-DEFFl-Gfvjv1HIJ_NXd_AYVNYCwmvE7juuyTvBXkYI','2026-09-24 04:13:57.331511','2026-10-01 04:13:57.000000',11,'f109409762cb4152ad23faeebd7c7c08'),(86,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MDgyODAzNywiaWF0IjoxNzkwMjIzMjM3LCJqdGkiOiIyMjlkMjNmZjQ1ZmE0MDczYjExMzIwNWU3YjlhZGNkNCIsInVzZXJfaWQiOiIxMSIsInJvbGUiOiJDTElOSUNfQURNSU4iLCJjbGluaWNfaWQiOjIsIm5hbWUiOiJtYWxhaWthIn0.oTEKy69kjJk-CP85iNA_4WBULHzoUMmdUYzJzn32TR8','2026-09-24 04:13:57.336528','2026-10-01 04:13:57.000000',11,'229d23ff45fa4073b113205e7b9adcd4');
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user`
--

DROP TABLE IF EXISTS `users_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `clinic_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `users_user_clinic_id_4cd2b9d9_fk_clinics_clinic_id` (`clinic_id`),
  CONSTRAINT `users_user_clinic_id_4cd2b9d9_fk_clinics_clinic_id` FOREIGN KEY (`clinic_id`) REFERENCES `clinics_clinic` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user`
--

LOCK TABLES `users_user` WRITE;
/*!40000 ALTER TABLE `users_user` DISABLE KEYS */;
INSERT INTO `users_user` VALUES (1,'pbkdf2_sha256$720000$4YLopUxywp87pdkaM4MQh9$t1EEr1RrOaHs2QFB/aRe24pGFhHDAHX/b3IjCJwJLnU=','2026-09-11 08:34:10.940090',1,'admin@medicore.com','Super Admin','SUPER_ADMIN',1,1,'2026-09-11 08:09:20.245644',NULL),(11,'pbkdf2_sha256$720000$mj3LErvjJXMmcv4hwMFnpm$oN00m/ClgKsz1bhk0YNBomC2sE+Bvpfiv2zjmWYiFqE=',NULL,0,'mikamalaika14@gmail.com','malaika','CLINIC_ADMIN',1,0,'2026-09-23 06:24:13.648661',2),(12,'pbkdf2_sha256$720000$0qQghJRR2NviVKaqcqJNMK$aG8j3kA5B/hUpiwrzD134EILcNjThJFDvp3GUy1hBJw=',NULL,0,'malaika@gmail.com','malaika','DOCTOR',1,0,'2026-09-23 06:41:55.250152',2),(13,'pbkdf2_sha256$720000$K8IAhkCLlaPudDiJAqdpuk$SJG1Xz7URvOkeyg/1jbRE2AF0Pq0LgJtOaIcWQ+jJjw=',NULL,0,'malaikaa@gmail.com','Malaika Mika','DOCTOR',1,0,'2026-09-23 06:45:58.102387',2),(14,'pbkdf2_sha256$720000$SQj977HshbVMsKsmbBPzzf$7R2iTOUKe1ye39If66SYyCx6VF08coTl7TGQzfBeR+0=',NULL,0,'malaik@gmail.com','Malaika Mika','DOCTOR',1,0,'2026-09-23 06:48:22.807124',2),(15,'pbkdf2_sha256$720000$0uPSXtRF66upNiZIbD2Gbh$hfoQVN2e2EIQ0zdWXXKQLFxGo8aXL3IhAx6d84CqI1U=',NULL,0,'mala@gmail.com','Malaika','PATIENT',1,0,'2026-09-23 06:51:28.615544',2);
/*!40000 ALTER TABLE `users_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_groups`
--

DROP TABLE IF EXISTS `users_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_groups_user_id_group_id_b88eab82_uniq` (`user_id`,`group_id`),
  KEY `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` (`group_id`),
  CONSTRAINT `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `users_user_groups_user_id_5f6f5a90_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_groups`
--

LOCK TABLES `users_user_groups` WRITE;
/*!40000 ALTER TABLE `users_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_user_permissions`
--

DROP TABLE IF EXISTS `users_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_user_permissions_user_id_permission_id_43338c45_uniq` (`user_id`,`permission_id`),
  KEY `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `users_user_user_permissions_user_id_20aca447_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_user_permissions`
--

LOCK TABLES `users_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `users_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-24 11:54:54
