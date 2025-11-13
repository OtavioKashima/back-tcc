-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema banco_tcc
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema banco_tcc
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `banco_tcc` DEFAULT CHARACTER SET utf8 ;
USE `banco_tcc` ;

-- -----------------------------------------------------
-- Table `banco_tcc`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `banco_tcc`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `banco_tcc`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `email` VARCHAR(200) NULL,
  `telefone` VARCHAR(200) NULL,
  `senha` VARCHAR(200) NOT NULL,
  `foto_perfil` VARCHAR(200) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `banco_tcc`.`postagens`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `banco_tcc`.`postagens` ;

CREATE TABLE IF NOT EXISTS `banco_tcc`.`postagens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo_postagem` ENUM('denuncia', 'doação', 'adoção') NOT NULL,
  `titulo` VARCHAR(150) NOT NULL,
  `descricao` TEXT NOT NULL,
  `raca` VARCHAR(150) NULL,
  `genero` ENUM('feminino', 'masculino', 'desconhecido') NULL,
  `idade` INT NULL,
  `foto` VARCHAR(200) NULL,
  `data_criacao` DATE NOT NULL,
  `usuarios_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_postagens_usuarios_idx` (`usuarios_id` ASC) VISIBLE,
  CONSTRAINT `fk_postagens_usuarios`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `banco_tcc`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `banco_tcc`.`comentarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `banco_tcc`.`comentarios` ;

CREATE TABLE IF NOT EXISTS `banco_tcc`.`comentarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comentario` TEXT NOT NULL,
  `usuarios_id` INT NOT NULL,
  `postagens_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comentarios_usuarios1_idx` (`usuarios_id` ASC) VISIBLE,
  INDEX `fk_comentarios_postagens1_idx` (`postagens_id` ASC) VISIBLE,
  CONSTRAINT `fk_comentarios_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `banco_tcc`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comentarios_postagens1`
    FOREIGN KEY (`postagens_id`)
    REFERENCES `banco_tcc`.`postagens` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;