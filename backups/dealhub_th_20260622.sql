mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: 127.0.0.1    Database: dealhub_th
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('b1406fa0-b545-47b2-b734-248bb981fce8','c8761e95eee13a04cefa5f3488ef04025e7e1723b3b20d63e8b6901f8ab7befc','2026-06-22 14:40:22.740','20260622144022_init',NULL,NULL,'2026-06-22 14:40:22.433',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `affiliate_clicks`
--

DROP TABLE IF EXISTS `affiliate_clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `affiliate_clicks` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marketplace` enum('SHOPEE','LAZADA','TIKTOK_SHOP','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `referrer` text COLLATE utf8mb4_unicode_ci,
  `clicked_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `affiliate_clicks_product_id_idx` (`product_id`),
  KEY `affiliate_clicks_clicked_at_idx` (`clicked_at`),
  KEY `affiliate_clicks_marketplace_idx` (`marketplace`),
  KEY `affiliate_clicks_user_id_fkey` (`user_id`),
  CONSTRAINT `affiliate_clicks_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `affiliate_clicks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `affiliate_clicks`
--

LOCK TABLES `affiliate_clicks` WRITE;
/*!40000 ALTER TABLE `affiliate_clicks` DISABLE KEYS */;
INSERT INTO `affiliate_clicks` VALUES ('cmqpc8t7000012epw75qlhe1u',NULL,'cmqpbom33001g2evz15ytxzog','SHOPEE',NULL,NULL,NULL,'2026-06-22 14:56:11.723');
/*!40000 ALTER TABLE `affiliate_clicks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_key` (`slug`),
  KEY `categories_parent_id_idx` (`parent_id`),
  KEY `categories_slug_idx` (`slug`),
  CONSTRAINT `categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('cmqpbom0z00022evz98qcokba','อิเล็กทรอนิกส์','electronics','เทียบราคาสมาร์ทโฟน แท็บเล็ต หูฟัง และอุปกรณ์อิเล็กทรอนิกส์ จาก Shopee Lazada TikTok Shop หาราคาดีที่สุดก่อนซื้อ','📱',NULL,NULL,1,1,'2026-06-22 14:40:29.315','2026-06-25 04:08:53.316'),('cmqpbom1300032evzyzzrdjo7','แฟชั่น','fashion','แฟชั่นและเสื้อผ้าแบรนด์ดัง เปรียบเทียบราคาจากทุกแพลตฟอร์ม อัปเดตโปรโมชั่นและดีลล่าสุดทุกวัน','👗',NULL,NULL,2,1,'2026-06-22 14:40:29.315','2026-06-25 04:08:53.316'),('cmqpbom1300042evzytiqje7k','บ้านและที่อยู่อาศัย','home-living','เฟอร์นิเจอร์ ของใช้ในบ้าน และเครื่องใช้ไฟฟ้า เลือกซื้อในราคาคุ้มค่าจากหลายแพลตฟอร์ม','🏠',NULL,NULL,4,1,'2026-06-22 14:40:29.315','2026-06-25 04:08:53.316'),('cmqpbom1400052evz8s5b55h2','ความงาม','beauty','สกินแคร์ เครื่องสำอาง และผลิตภัณฑ์บำรุงความงาม เทียบราคาจากร้านค้าออนไลน์ชั้นนำในที่เดียว','💄',NULL,NULL,3,1,'2026-06-22 14:40:29.315','2026-06-25 04:08:53.316'),('cmqpbom1500062evzih8qqaoj','กีฬาและกลางแจ้ง','sports','อุปกรณ์กีฬาและกิจกรรมกลางแจ้ง เทียบราคาและโปรโมชั่นจาก Shopee Lazada TikTok Shop','⚽',NULL,NULL,5,1,'2026-06-22 14:40:29.315','2026-06-25 04:08:53.316');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compare_items`
--

DROP TABLE IF EXISTS `compare_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compare_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `compare_list_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `compare_items_compare_list_id_product_id_key` (`compare_list_id`,`product_id`),
  KEY `compare_items_product_id_fkey` (`product_id`),
  CONSTRAINT `compare_items_compare_list_id_fkey` FOREIGN KEY (`compare_list_id`) REFERENCES `compare_lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compare_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compare_items`
--

LOCK TABLES `compare_items` WRITE;
/*!40000 ALTER TABLE `compare_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `compare_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compare_lists`
--

DROP TABLE IF EXISTS `compare_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compare_lists` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `compare_lists_user_id_fkey` (`user_id`),
  CONSTRAINT `compare_lists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compare_lists`
--

LOCK TABLES `compare_lists` WRITE;
/*!40000 ALTER TABLE `compare_lists` DISABLE KEYS */;
/*!40000 ALTER TABLE `compare_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_alerts`
--

DROP TABLE IF EXISTS `price_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_alerts` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `notified_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `price_alerts_user_id_idx` (`user_id`),
  KEY `price_alerts_is_active_idx` (`is_active`),
  KEY `price_alerts_product_id_fkey` (`product_id`),
  CONSTRAINT `price_alerts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `price_alerts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_alerts`
--

LOCK TABLES `price_alerts` WRITE;
/*!40000 ALTER TABLE `price_alerts` DISABLE KEYS */;
/*!40000 ALTER TABLE `price_alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_history`
--

DROP TABLE IF EXISTS `price_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_history` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `recorded_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `price_history_product_id_recorded_at_idx` (`product_id`,`recorded_at`),
  KEY `price_history_listing_id_recorded_at_idx` (`listing_id`,`recorded_at`),
  CONSTRAINT `price_history_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `product_listings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `price_history_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_history`
--

LOCK TABLES `price_history` WRITE;
/*!40000 ALTER TABLE `price_history` DISABLE KEYS */;
INSERT INTO `price_history` VALUES ('cmqpbom1s000c2evzs2ktebbu','cmqpbom1900082evz6iiov08a',NULL,45900.00,'2026-06-22 14:40:29.343'),('cmqpbom1x000g2evzceupmxn0','cmqpbom1900082evz6iiov08a',NULL,46500.00,'2026-06-22 14:40:29.349'),('cmqpbom23000k2evzjsrcc970','cmqpbom1900082evz6iiov08a',NULL,45200.00,'2026-06-22 14:40:29.355'),('cmqpbom29000q2evzo6505uhu','cmqpbom25000m2evzs6dc60zi',NULL,38900.00,'2026-06-22 14:40:29.361'),('cmqpbom2d000u2evzkvo6r152','cmqpbom25000m2evzs6dc60zi',NULL,39500.00,'2026-06-22 14:40:29.365'),('cmqpbom2k00102evzpg1fp0d5','cmqpbom2e000w2evztr73e5mi',NULL,199.00,'2026-06-22 14:40:29.372'),('cmqpbom2o00142evz7zlwyswr','cmqpbom2e000w2evztr73e5mi',NULL,179.00,'2026-06-22 14:40:29.376'),('cmqpbom2w001a2evzz5myy33b','cmqpbom2r00162evzqjn6asfv',NULL,299.00,'2026-06-22 14:40:29.384'),('cmqpbom32001e2evz46b2wnvk','cmqpbom2r00162evzqjn6asfv',NULL,320.00,'2026-06-22 14:40:29.390'),('cmqpbom38001k2evzno0b1am4','cmqpbom33001g2evz15ytxzog',NULL,1290.00,'2026-06-22 14:40:29.396'),('cmqpbom3c001o2evzbcqzvmfv','cmqpbom33001g2evz15ytxzog',NULL,1350.00,'2026-06-22 14:40:29.400'),('cmqpbom3g001s2evzsv10ta2s','cmqpbom33001g2evz15ytxzog',NULL,1190.00,'2026-06-22 14:40:29.403'),('cmqpbom3m001y2evzl6td94ih','cmqpbom3i001u2evz7ij96oum',NULL,12900.00,'2026-06-22 14:40:29.409'),('cmqpbom3q00222evz6yto5w2s','cmqpbom3i001u2evz7ij96oum',NULL,13500.00,'2026-06-22 14:40:29.414'),('cmqpc1rzm000c2efftugyn26w','cmqpbom1900082evz6iiov08a',NULL,45900.00,'2026-06-22 14:50:43.569'),('cmqpc1rzs000g2eff5z8lb96s','cmqpbom1900082evz6iiov08a',NULL,46500.00,'2026-06-22 14:50:43.576'),('cmqpc1rzv000k2effojibucew','cmqpbom1900082evz6iiov08a',NULL,45200.00,'2026-06-22 14:50:43.579'),('cmqpc1rzz000q2effybgfny1v','cmqpbom25000m2evzs6dc60zi',NULL,38900.00,'2026-06-22 14:50:43.583'),('cmqpc1s01000u2effz0zlghbu','cmqpbom25000m2evzs6dc60zi',NULL,39500.00,'2026-06-22 14:50:43.585'),('cmqpc1s0600102effgzwdqtsj','cmqpbom2e000w2evztr73e5mi',NULL,199.00,'2026-06-22 14:50:43.590'),('cmqpc1s0800142eff2u6dqxt2','cmqpbom2e000w2evztr73e5mi',NULL,179.00,'2026-06-22 14:50:43.592'),('cmqpc1s0d001a2effxlf2izdt','cmqpbom2r00162evzqjn6asfv',NULL,299.00,'2026-06-22 14:50:43.597'),('cmqpc1s0i001e2effukzt71fj','cmqpbom2r00162evzqjn6asfv',NULL,320.00,'2026-06-22 14:50:43.602'),('cmqpc1s0p001k2effgb243ncw','cmqpbom33001g2evz15ytxzog',NULL,1290.00,'2026-06-22 14:50:43.608'),('cmqpc1s0s001o2eff1elakw15','cmqpbom33001g2evz15ytxzog',NULL,1350.00,'2026-06-22 14:50:43.612'),('cmqpc1s0v001s2eff0fsfnf5q','cmqpbom33001g2evz15ytxzog',NULL,1190.00,'2026-06-22 14:50:43.615'),('cmqpc1s0z001y2effa9kwp12k','cmqpbom3i001u2evz7ij96oum',NULL,12900.00,'2026-06-22 14:50:43.619'),('cmqpc1s1400222effly3o9jgs','cmqpbom3i001u2evz7ij96oum',NULL,13500.00,'2026-06-22 14:50:43.624'),('cmqpc6ku4000c2ea9nea1x54g','cmqpbom1900082evz6iiov08a',NULL,45900.00,'2026-06-22 14:54:27.579'),('cmqpc6ku9000g2ea9zdkfn3pi','cmqpbom1900082evz6iiov08a',NULL,46500.00,'2026-06-22 14:54:27.585'),('cmqpc6kud000k2ea9g01jmzsj','cmqpbom1900082evz6iiov08a',NULL,45200.00,'2026-06-22 14:54:27.589'),('cmqpc6kuh000q2ea9led2jfzt','cmqpbom25000m2evzs6dc60zi',NULL,38900.00,'2026-06-22 14:54:27.593'),('cmqpc6kuk000u2ea9wvzbbtim','cmqpbom25000m2evzs6dc60zi',NULL,39500.00,'2026-06-22 14:54:27.596'),('cmqpc6kup00102ea9lq603khg','cmqpbom2e000w2evztr73e5mi',NULL,199.00,'2026-06-22 14:54:27.601'),('cmqpc6kut00142ea9ggof2pbz','cmqpbom2e000w2evztr73e5mi',NULL,179.00,'2026-06-22 14:54:27.605'),('cmqpc6kux001a2ea9jfpapkqu','cmqpbom2r00162evzqjn6asfv',NULL,299.00,'2026-06-22 14:54:27.609'),('cmqpc6kv0001e2ea9lggz50yf','cmqpbom2r00162evzqjn6asfv',NULL,320.00,'2026-06-22 14:54:27.612'),('cmqpc6kv5001k2ea970z908zm','cmqpbom33001g2evz15ytxzog',NULL,1290.00,'2026-06-22 14:54:27.617'),('cmqpc6kv9001o2ea9ofgagp9w','cmqpbom33001g2evz15ytxzog',NULL,1350.00,'2026-06-22 14:54:27.621'),('cmqpc6kvc001s2ea99y718z99','cmqpbom33001g2evz15ytxzog',NULL,1190.00,'2026-06-22 14:54:27.624'),('cmqpc6kvi001y2ea9dcpzohqg','cmqpbom3i001u2evz7ij96oum',NULL,12900.00,'2026-06-22 14:54:27.630'),('cmqpc6kvl00222ea9r1j2nahs','cmqpbom3i001u2evz7ij96oum',NULL,13500.00,'2026-06-22 14:54:27.633'),('cmqsyn2ud000c2ecppeq3e86c','cmqpbom1900082evz6iiov08a',NULL,45900.00,'2026-06-25 03:46:27.493'),('cmqsyn2ui000g2ecpnasilgfc','cmqpbom1900082evz6iiov08a',NULL,46500.00,'2026-06-25 03:46:27.498'),('cmqsyn2uk000k2ecpmadavcty','cmqpbom1900082evz6iiov08a',NULL,45200.00,'2026-06-25 03:46:27.500'),('cmqsyn2uo000q2ecp62i2f9p5','cmqpbom25000m2evzs6dc60zi',NULL,38900.00,'2026-06-25 03:46:27.504'),('cmqsyn2uq000u2ecpa8wx7v0x','cmqpbom25000m2evzs6dc60zi',NULL,39500.00,'2026-06-25 03:46:27.506'),('cmqsyn2uu00102ecpnmu2eznq','cmqpbom2e000w2evztr73e5mi',NULL,199.00,'2026-06-25 03:46:27.510'),('cmqsyn2uw00142ecp1z3py5xm','cmqpbom2e000w2evztr73e5mi',NULL,179.00,'2026-06-25 03:46:27.512'),('cmqsyn2uy001a2ecpbka0dx7m','cmqpbom2r00162evzqjn6asfv',NULL,299.00,'2026-06-25 03:46:27.514'),('cmqsyn2v0001e2ecp7oia82y8','cmqpbom2r00162evzqjn6asfv',NULL,320.00,'2026-06-25 03:46:27.516'),('cmqsyn2v2001k2ecp7zx1p7i9','cmqpbom33001g2evz15ytxzog',NULL,1290.00,'2026-06-25 03:46:27.518'),('cmqsyn2v4001o2ecpcyu0a3vx','cmqpbom33001g2evz15ytxzog',NULL,1350.00,'2026-06-25 03:46:27.520'),('cmqsyn2v7001s2ecpv4p3bu0f','cmqpbom33001g2evz15ytxzog',NULL,1190.00,'2026-06-25 03:46:27.523'),('cmqsyn2va001y2ecpnbyxv26a','cmqpbom3i001u2evz7ij96oum',NULL,12900.00,'2026-06-25 03:46:27.526'),('cmqsyn2vb00222ecpmxebn2o2','cmqpbom3i001u2evz7ij96oum',NULL,13500.00,'2026-06-25 03:46:27.527'),('cmqszfxbb000c2ebjniv66nuf','cmqpbom1900082evz6iiov08a',NULL,45900.00,'2026-06-25 04:08:53.350'),('cmqszfxbf000g2ebjhoizrlnt','cmqpbom1900082evz6iiov08a',NULL,46500.00,'2026-06-25 04:08:53.355'),('cmqszfxbk000k2ebjlloxqt77','cmqpbom1900082evz6iiov08a',NULL,45200.00,'2026-06-25 04:08:53.359'),('cmqszfxbo000q2ebjzsxpupch','cmqpbom25000m2evzs6dc60zi',NULL,38900.00,'2026-06-25 04:08:53.364'),('cmqszfxbr000u2ebjx3jaev9s','cmqpbom25000m2evzs6dc60zi',NULL,39500.00,'2026-06-25 04:08:53.367'),('cmqszfxbv00102ebjsmwaeldk','cmqpbom2e000w2evztr73e5mi',NULL,199.00,'2026-06-25 04:08:53.371'),('cmqszfxbx00142ebjomwdzfj5','cmqpbom2e000w2evztr73e5mi',NULL,179.00,'2026-06-25 04:08:53.373'),('cmqszfxc0001a2ebj74i56kcd','cmqpbom2r00162evzqjn6asfv',NULL,299.00,'2026-06-25 04:08:53.376'),('cmqszfxc3001e2ebjszkr5b6n','cmqpbom2r00162evzqjn6asfv',NULL,320.00,'2026-06-25 04:08:53.379'),('cmqszfxc7001k2ebj4bpkmoeq','cmqpbom33001g2evz15ytxzog',NULL,1290.00,'2026-06-25 04:08:53.383'),('cmqszfxc9001o2ebjjoxqc3ur','cmqpbom33001g2evz15ytxzog',NULL,1350.00,'2026-06-25 04:08:53.385'),('cmqszfxcb001s2ebj07lra00t','cmqpbom33001g2evz15ytxzog',NULL,1190.00,'2026-06-25 04:08:53.387'),('cmqszfxce001y2ebjln77a8bd','cmqpbom3i001u2evz7ij96oum',NULL,12900.00,'2026-06-25 04:08:53.390'),('cmqszfxci00222ebje6jkakei','cmqpbom3i001u2evz7ij96oum',NULL,13500.00,'2026-06-25 04:08:53.394');
/*!40000 ALTER TABLE `price_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_listings`
--

DROP TABLE IF EXISTS `product_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_listings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marketplace` enum('SHOPEE','LAZADA','TIKTOK_SHOP','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `external_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `original_price` decimal(12,2) DEFAULT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'THB',
  `affiliate_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `shop_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shop_url` text COLLATE utf8mb4_unicode_ci,
  `rating` decimal(3,2) DEFAULT NULL,
  `sold_count` int NOT NULL DEFAULT '0',
  `stock` int DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `last_synced_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_listings_marketplace_external_id_key` (`marketplace`,`external_id`),
  KEY `product_listings_product_id_idx` (`product_id`),
  KEY `product_listings_marketplace_idx` (`marketplace`),
  KEY `product_listings_price_idx` (`price`),
  CONSTRAINT `product_listings_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_listings`
--

LOCK TABLES `product_listings` WRITE;
/*!40000 ALTER TABLE `product_listings` DISABLE KEYS */;
INSERT INTO `product_listings` VALUES ('cmqpbom1l000a2evznbzw6w65','cmqpbom1900082evz6iiov08a','SHOPEE','shopee-iphone15','iPhone 15 Pro Max 256GB',45900.00,48900.00,'THB','https://shopee.co.th/product/shopee-iphone15?aff=dealhub','Apple Official Store',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.337','2026-06-25 04:08:53.347'),('cmqpbom1v000e2evzp27ju8x4','cmqpbom1900082evz6iiov08a','LAZADA','lazada-iphone15','iPhone 15 Pro Max 256GB',46500.00,48900.00,'THB','https://lazada.co.th/product/lazada-iphone15?aff=dealhub','Lazada Apple',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.348','2026-06-25 04:08:53.353'),('cmqpbom1z000i2evzvmte7w4e','cmqpbom1900082evz6iiov08a','TIKTOK_SHOP','tiktok-iphone15','iPhone 15 Pro Max 256GB',45200.00,48900.00,'THB','https://tiktok_shop.co.th/product/tiktok-iphone15?aff=dealhub','TikTok Apple TH',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.351','2026-06-25 04:08:53.357'),('cmqpbom27000o2evziahx0vp7','cmqpbom25000m2evzs6dc60zi','SHOPEE','shopee-s24','Samsung Galaxy S24 Ultra',38900.00,42900.00,'THB','https://shopee.co.th/product/shopee-s24?aff=dealhub','Samsung Official',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.360','2026-06-25 04:08:53.363'),('cmqpbom2b000s2evzwjf2a4fc','cmqpbom25000m2evzs6dc60zi','LAZADA','lazada-s24','Samsung Galaxy S24 Ultra',39500.00,42900.00,'THB','https://lazada.co.th/product/lazada-s24?aff=dealhub','Samsung Lazada',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.363','2026-06-25 04:08:53.366'),('cmqpbom2h000y2evzokm44fng','cmqpbom2e000w2evztr73e5mi','SHOPEE','shopee-tshirt','เสื้อยืด Oversize คอตตอน 100%',199.00,399.00,'THB','https://shopee.co.th/product/shopee-tshirt?aff=dealhub','Fashion TH',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.369','2026-06-25 04:08:53.371'),('cmqpbom2m00122evz7rl49131','cmqpbom2e000w2evztr73e5mi','TIKTOK_SHOP','tiktok-tshirt','เสื้อยืด Oversize คอตตอน 100%',179.00,399.00,'THB','https://tiktok_shop.co.th/product/tiktok-tshirt?aff=dealhub','TikTok Fashion',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.374','2026-06-25 04:08:53.373'),('cmqpbom2u00182evz9ksy5w12','cmqpbom2r00162evzqjn6asfv','SHOPEE','shopee-serum','เซรั่มวิตามินซี บำรุงผิว',299.00,590.00,'THB','https://shopee.co.th/product/shopee-serum?aff=dealhub','Beauty Store',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.382','2026-06-25 04:08:53.376'),('cmqpbom2z001c2evzjttj7ugk','cmqpbom2r00162evzqjn6asfv','LAZADA','lazada-serum','เซรั่มวิตามินซี บำรุงผิว',320.00,590.00,'THB','https://lazada.co.th/product/lazada-serum?aff=dealhub','Lazada Beauty',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.387','2026-06-25 04:08:53.378'),('cmqpbom36001i2evz2rtrb6ni','cmqpbom33001g2evz15ytxzog','SHOPEE','shopee-headphone','หูฟัง Bluetooth ANC Pro',1290.00,2490.00,'THB','https://shopee.co.th/product/shopee-headphone?aff=dealhub','Audio Shop',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.394','2026-06-25 04:08:53.382'),('cmqpbom3a001m2evzeehzgrwp','cmqpbom33001g2evz15ytxzog','LAZADA','lazada-headphone','หูฟัง Bluetooth ANC Pro',1350.00,2490.00,'THB','https://lazada.co.th/product/lazada-headphone?aff=dealhub','Lazada Audio',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.398','2026-06-25 04:08:53.384'),('cmqpbom3e001q2evzcm6a46z0','cmqpbom33001g2evz15ytxzog','TIKTOK_SHOP','tiktok-headphone','หูฟัง Bluetooth ANC Pro',1190.00,2490.00,'THB','https://tiktok_shop.co.th/product/tiktok-headphone?aff=dealhub','TikTok Audio',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.402','2026-06-25 04:08:53.386'),('cmqpbom3k001w2evz2u1gi7ob','cmqpbom3i001u2evz7ij96oum','SHOPEE','shopee-sofa','โซฟา 3 ที่นั่ง ผ้ากำมะหยี่',12900.00,18900.00,'THB','https://shopee.co.th/product/shopee-sofa?aff=dealhub','Home Furniture',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.408','2026-06-25 04:08:53.390'),('cmqpbom3n00202evzfsv0h1fo','cmqpbom3i001u2evz7ij96oum','LAZADA','lazada-sofa','โซฟา 3 ที่นั่ง ผ้ากำมะหยี่',13500.00,18900.00,'THB','https://lazada.co.th/product/lazada-sofa?aff=dealhub','Lazada Home',NULL,NULL,0,NULL,1,NULL,'2026-06-22 14:40:29.412','2026-06-25 04:08:53.392');
/*!40000 ALTER TABLE `product_listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` json DEFAULT NULL,
  `category_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `review_count` int NOT NULL DEFAULT '0',
  `sold_count` int NOT NULL DEFAULT '0',
  `is_trending` tinyint(1) NOT NULL DEFAULT '0',
  `is_top_selling` tinyint(1) NOT NULL DEFAULT '0',
  `search_keywords` text COLLATE utf8mb4_unicode_ci,
  `ai_review_summary` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_key` (`slug`),
  KEY `products_category_id_idx` (`category_id`),
  KEY `products_is_trending_idx` (`is_trending`),
  KEY `products_is_top_selling_idx` (`is_top_selling`),
  KEY `products_sold_count_idx` (`sold_count`),
  FULLTEXT KEY `products_name_search_keywords_idx` (`name`,`search_keywords`),
  CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('cmqpbom1900082evz6iiov08a','iPhone 15 Pro Max 256GB','iphone-15-pro-max-256gb',NULL,'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80',NULL,'cmqpbom0z00022evz98qcokba','Apple',4.80,1250,8500,1,1,'iphone 15 pro max apple สมาร์ทโฟน',NULL,'2026-06-22 14:40:29.325','2026-06-25 04:08:53.342'),('cmqpbom25000m2evzs6dc60zi','Samsung Galaxy S24 Ultra','samsung-galaxy-s24-ultra',NULL,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',NULL,'cmqpbom0z00022evz98qcokba','Samsung',4.70,980,6200,1,1,'samsung galaxy s24 ultra สมาร์ทโฟน','สรุปรีวิวสินค้า \"Samsung Galaxy S24 Ultra\" จาก 980 รีวิว:\nคะแนนเฉลี่ย 4.7/5 ขายแล้ว 6,200 ชิ้น\nพบใน SHOPEE, LAZADA\nแบรนด์: Samsung\nสินค้านี้ได้รับความนิยมในหมวดที่เกี่ยวข้อง ราคาแข่งขันได้ดีเมื่อเทียบกับแพลตฟอร์มอื่น แนะนำสำหรับผู้ที่มองหาคุณภาพในราคาที่คุ้มค่า','2026-06-22 14:40:29.358','2026-06-25 04:08:53.361'),('cmqpbom2e000w2evztr73e5mi','เสื้อยืด Oversize คอตตอน 100%','oversize-cotton-tshirt',NULL,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',NULL,'cmqpbom1300032evzyzzrdjo7','Local Brand',4.50,3200,15000,1,1,'เสื้อยืด oversize แฟชั่น',NULL,'2026-06-22 14:40:29.367','2026-06-25 04:08:53.369'),('cmqpbom2r00162evzqjn6asfv','เซรั่มวิตามินซี บำรุงผิว','vitamin-c-serum',NULL,'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',NULL,'cmqpbom1400052evz8s5b55h2','Beauty Pro',4.60,5600,22000,1,0,'เซรั่ม วิตามินซี บำรุงผิว ความงาม',NULL,'2026-06-22 14:40:29.379','2026-06-25 04:08:53.375'),('cmqpbom33001g2evz15ytxzog','หูฟัง Bluetooth ANC Pro','bluetooth-anc-headphones',NULL,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',NULL,'cmqpbom0z00022evz98qcokba','SoundMax',4.40,2100,9800,0,1,'หูฟัง bluetooth anc ไร้สาย','สรุปรีวิวสินค้า \"หูฟัง Bluetooth ANC Pro\" จาก 2100 รีวิว:\nคะแนนเฉลี่ย 4.4/5 ขายแล้ว 9,800 ชิ้น\nพบใน SHOPEE, LAZADA, TIKTOK_SHOP\nแบรนด์: SoundMax\nสินค้านี้ได้รับความนิยมในหมวดที่เกี่ยวข้อง ราคาแข่งขันได้ดีเมื่อเทียบกับแพลตฟอร์มอื่น แนะนำสำหรับผู้ที่มองหาคุณภาพในราคาที่คุ้มค่า','2026-06-22 14:40:29.392','2026-06-25 04:08:53.380'),('cmqpbom3i001u2evz7ij96oum','โซฟา 3 ที่นั่ง ผ้ากำมะหยี่','velvet-sofa-3-seater',NULL,'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',NULL,'cmqpbom1300042evzytiqje7k','HomeStyle',4.30,450,1200,0,0,'โซฟา บ้าน เฟอร์นิเจอร์','สรุปรีวิวสินค้า \"โซฟา 3 ที่นั่ง ผ้ากำมะหยี่\" จาก 450 รีวิว:\nคะแนนเฉลี่ย 4.3/5 ขายแล้ว 1,200 ชิ้น\nพบใน SHOPEE, LAZADA\nแบรนด์: HomeStyle\nสินค้านี้ได้รับความนิยมในหมวดที่เกี่ยวข้อง ราคาแข่งขันได้ดีเมื่อเทียบกับแพลตฟอร์มอื่น แนะนำสำหรับผู้ที่มองหาคุณภาพในราคาที่คุ้มค่า','2026-06-22 14:40:29.406','2026-06-25 04:08:53.389');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `role_permissions_permission_id_fkey` (`permission_id`),
  CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_logs`
--

DROP TABLE IF EXISTS `search_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `search_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `query` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `results` int NOT NULL DEFAULT '0',
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `search_logs_query_idx` (`query`),
  KEY `search_logs_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_logs`
--

LOCK TABLES `search_logs` WRITE;
/*!40000 ALTER TABLE `search_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `search_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trending_keywords`
--

DROP TABLE IF EXISTS `trending_keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trending_keywords` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyword` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL DEFAULT '1',
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trending_keywords_keyword_key` (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trending_keywords`
--

LOCK TABLES `trending_keywords` WRITE;
/*!40000 ALTER TABLE `trending_keywords` DISABLE KEYS */;
INSERT INTO `trending_keywords` VALUES ('cmqpbom3s00232evza4kw2bmu','iphone',795,'2026-06-25 04:08:53.395'),('cmqpbom3x00242evzdc5v390w','samsung',407,'2026-06-25 04:08:53.399'),('cmqpbom3z00252evz9ul967ws','เสื้อยืด',569,'2026-06-25 04:08:53.401'),('cmqpbom4100262evz0atg86it','เซรั่ม',752,'2026-06-25 04:08:53.403'),('cmqpbom4300272evzm2m39ifw','หูฟัง',562,'2026-06-25 04:08:53.404'),('cmqpbom4700282evzy311puuw','โซฟา',746,'2026-06-25 04:08:53.405'),('cmqpbom4900292evz4cb066g9','สมาร์ทโฟน',714,'2026-06-25 04:08:53.407'),('cmqpbom4b002a2evzl98sz3o3','แฟชั่น',638,'2026-06-25 04:08:53.408');
/*!40000 ALTER TABLE `trending_keywords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN','SUPER_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `status` enum('ACTIVE','INACTIVE','BANNED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `refresh_token` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cmqpbom0m00002evzbp5z1pdh','admin@dealhub.th','$2b$12$yc2jyGnp9XSHObXzLPDsB.9jDeVTfIs4zoTECHEXGPFnbzVSs9SBe','ผู้ดูแลระบบ',NULL,'SUPER_ADMIN','ACTIVE',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXFwYm9tMG0wMDAwMmV2emJwNXoxcGRoIiwiZW1haWwiOiJhZG1pbkBkZWFsaHViLnRoIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzgyMTgxNDc4LCJleHAiOjE3ODI3ODYyNzh9.WhZ5bN5T1CgKoeHpU1pxJhJt_A1aMzOFSsFFkjmPj2U','2026-06-22 14:40:29.302','2026-06-23 02:24:38.324'),('cmqpbom0u00012evzje7n0twb','user@dealhub.th','$2b$12$DNi/Np5PTuJbhLstkgsni..zlzSaes8tsMyVnoUkB0YBuzxA.6lyi','สมชาย ใจดี',NULL,'USER','ACTIVE',1,NULL,'2026-06-22 14:40:29.310','2026-06-22 14:40:29.310');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlists_user_id_product_id_key` (`user_id`,`product_id`),
  KEY `wishlists_product_id_fkey` (`product_id`),
  CONSTRAINT `wishlists_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wishlists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
mysqldump: Couldn't execute 'SELECT LIBRARY_NAME FROM INFORMATION_SCHEMA.LIBRARIES WHERE LIBRARY_SCHEMA = 'dealhub_th' ORDER BY LIBRARY_NAME': Unknown table 'LIBRARIES' in information_schema (1109)
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dealhub_th'
--
