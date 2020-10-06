const { check } = require('express-validator')

exports.listarPorId = [
  check('idConta')
    .exists().withMessage('O id não pode estar em branco')
    .isInt().withMessage('O id deve ser numérico')
]

exports.inserir = [
  check('idPessoa')
    .exists().withMessage('O idPessoa não pode estar em branco')
    .isInt().withMessage('O idPessoa deve ser numérico'),
  check('saldo')
    .exists().trim().withMessage('O saldo não pode estar em branco')
    .isFloat().withMessage('O valor deve ser monetário'),
  check('tipoConta')
    .exists().trim().withMessage('O tipoConta não pode estar em branco')
    .isInt().withMessage('O tipoConta deve ser numérico')
]

exports.depositoSaque = [
  check('idConta')
    .exists().withMessage('O idConta não pode estar em branco')
    .isFloat().withMessage('O idConta deve ser monetário'),
  check('valor').exists().trim().withMessage('O valor não pode estar em branco')
    .isFloat().withMessage('O valor deve ser monetário')
]