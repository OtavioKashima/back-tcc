-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema pet_connect
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pet_connect
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pet_connect` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `pet_connect` ;

-- -----------------------------------------------------
-- Table `pet_connect`.`login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_connect`.`login` (
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `senha` VARCHAR(255) NULL DEFAULT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `pet_connect`.`registro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_connect`.`registro` (
  `nome` VARCHAR(255) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `cpf_UNIQUE` ON `pet_connect`.`registro` (`cpf` ASC) VISIBLE;

CREATE UNIQUE INDEX `email_UNIQUE` ON `pet_connect`.`registro` (`email` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
