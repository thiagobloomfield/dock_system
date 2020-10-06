const express = require('express')
const router = express.Router()
const pessoaController = require('../controllers/pessoaController')
const apiController = require('../controllers/apiController')
const pessoaValidation = require('../util/pessoaValidation')

router.get('/', apiController.verificar, pessoaController.listar)
router.get('/:idPessoa', [pessoaValidation.listarPorId], pessoaController.listarPorId)
router.post('/', apiController.verificar, pessoaController.inserir)
router.put('/:idPessoa', apiController.verificar, pessoaController.alterar)
router.delete('/:idPessoa', apiController.verificar, pessoaController.deletar)

module.exports = router
