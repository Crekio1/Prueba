CREATE DATABASE IF NOT EXISTS `optativa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `optativa`;

CREATE TABLE IF NOT EXISTS `vinylos` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` varchar(50) NOT NULL,
  `artista` varchar(50) NOT NULL,
  `precio` decimal(13, 3) NOT NULL,
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `vinylos` (`nombre`, `artista`, `precio`) VALUES
('Thriller', 'Michael Jackson', 1982.11);