const express = require('express')
const router = express.Router()
const contaController = require('../controllers/contaController')
const apiController = require('../controllers/apiController')
const contaValidator = require('../util/contaValidator')

router.get('/', apiController.verificar, contaController.listar)
router.get('/:idConta', [apiController.verificar, contaValidator.listarPorId], contaController.listarPorId)
router.get('/:idConta/extrato-completo', [apiController.verificar, contaValidator.listarPorId], contaController.extratoCompleto)
router.get('/:idConta/extrato-por-periodo', [apiController.verificar, contaValidator.listarPorId], contaController.extratoPorPeriodo)
router.post('/', [apiController.verificar, contaValidator.inserir], contaController.inserir)
router.post('/deposito', [apiController.verificar, contaValidator.depositoSaque], contaController.deposito)
router.put('/saque', [apiController.verificar, contaValidator.depositoSaque], contaController.saque)
router.put('/:idConta/bloquear', [apiController.verificar, contaValidator.listarPorId], contaController.bloquear)
router.put('/:idConta/desbloquear', [apiController.verificar, contaValidator.listarPorId], contaController.desbloquear)

module.exports = router
