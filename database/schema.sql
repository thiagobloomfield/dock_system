-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           8.0.21 - MySQL Community Server - GPL
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Copiando estrutura do banco de dados para teste_dock
DROP DATABASE IF EXISTS `teste_dock`;
CREATE DATABASE IF NOT EXISTS `teste_dock` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `teste_dock`;

-- Copiando estrutura para tabela teste_dock.contas
DROP TABLE IF EXISTS `contas`;
CREATE TABLE IF NOT EXISTS `contas` (
  `idConta` int NOT NULL AUTO_INCREMENT,
  `idPessoa` int NOT NULL,
  `saldo` decimal(10,2) NOT NULL,
  `limiteSaqueDiario` decimal(10,2) DEFAULT NULL,
  `flagAtivo` int NOT NULL DEFAULT '1',
  `tipoConta` int DEFAULT NULL,
  `dataCriacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idConta`,`idPessoa`),
  KEY `fk_conta_pessoa_idx` (`idPessoa`),
  CONSTRAINT `fk_conta_pessoa` FOREIGN KEY (`idPessoa`) REFERENCES `pessoas` (`idPessoa`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_dock.contas: ~2 rows (aproximadamente)
DELETE FROM `contas`;
/*!40000 ALTER TABLE `contas` DISABLE KEYS */;
INSERT INTO `contas` (`idConta`, `idPessoa`, `saldo`, `limiteSaqueDiario`, `flagAtivo`, `tipoConta`, `dataCriacao`) VALUES
	(1, 2, 100.00, 100.00, 1, 1, '2020-10-06 09:51:50'),
	(2, 1, 2800.00, 150.00, 1, 1, '2020-10-06 09:52:05');
/*!40000 ALTER TABLE `contas` ENABLE KEYS */;

-- Copiando estrutura para tabela teste_dock.pessoas
DROP TABLE IF EXISTS `pessoas`;
CREATE TABLE IF NOT EXISTS `pessoas` (
  `idPessoa` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `cpf` varchar(45) NOT NULL,
  `dataNascimento` date NOT NULL,
  `flagAtivo` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idPessoa`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_dock.pessoas: ~2 rows (aproximadamente)
DELETE FROM `pessoas`;
/*!40000 ALTER TABLE `pessoas` DISABLE KEYS */;
INSERT INTO `pessoas` (`idPessoa`, `nome`, `cpf`, `dataNascimento`, `flagAtivo`) VALUES
	(1, 'Thiago 1', '12312312312', '1988-04-09', 1),
	(2, 'Thiago', '12312312312', '1988-04-09', 1);
/*!40000 ALTER TABLE `pessoas` ENABLE KEYS */;

-- Copiando estrutura para tabela teste_dock.tipo_transacao
DROP TABLE IF EXISTS `tipo_transacao`;
CREATE TABLE IF NOT EXISTS `tipo_transacao` (
  `idTipoTransacao` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(45) NOT NULL,
  PRIMARY KEY (`idTipoTransacao`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_dock.tipo_transacao: ~4 rows (aproximadamente)
DELETE FROM `tipo_transacao`;
/*!40000 ALTER TABLE `tipo_transacao` DISABLE KEYS */;
INSERT INTO `tipo_transacao` (`idTipoTransacao`, `descricao`) VALUES
	(1, 'depósito'),
	(2, 'saque'),
	(3, 'transferência realizada'),
	(4, 'transferência recebida');
/*!40000 ALTER TABLE `tipo_transacao` ENABLE KEYS */;

-- Copiando estrutura para tabela teste_dock.transacoes
DROP TABLE IF EXISTS `transacoes`;
CREATE TABLE IF NOT EXISTS `transacoes` (
  `idTransacao` int NOT NULL AUTO_INCREMENT,
  `idTipoTransacao` int NOT NULL,
  `idConta` int NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `dataTransacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idTransacao`,`idTipoTransacao`,`idConta`),
  KEY `fk_transacao_conta_idx` (`idConta`),
  KEY `fk_transacao_tipo_idx` (`idTipoTransacao`),
  CONSTRAINT `fk_transacao_conta` FOREIGN KEY (`idConta`) REFERENCES `contas` (`idConta`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_transacao_tipo` FOREIGN KEY (`idTipoTransacao`) REFERENCES `tipo_transacao` (`idTipoTransacao`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_dock.transacoes: ~3 rows (aproximadamente)
DELETE FROM `transacoes`;
/*!40000 ALTER TABLE `transacoes` DISABLE KEYS */;
INSERT INTO `transacoes` (`idTransacao`, `idTipoTransacao`, `idConta`, `valor`, `dataTransacao`) VALUES
	(12, 2, 2, 200.00, '2020-10-06 15:22:44'),
	(13, 1, 2, 500.00, '2020-10-06 15:23:09'),
	(14, 1, 2, 1500.00, '2020-10-06 15:23:13'),
	(15, 2, 2, 200.00, '2020-10-06 16:32:48');
/*!40000 ALTER TABLE `transacoes` ENABLE KEYS */;

-- Copiando estrutura para tabela teste_dock.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(45) NOT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_dock.usuarios: ~1 rows (aproximadamente)
DELETE FROM `usuarios`;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`idUsuario`, `nome`, `email`, `senha`) VALUES
	(1, 'adm', 'adm@adm.com.br', 'adm');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
