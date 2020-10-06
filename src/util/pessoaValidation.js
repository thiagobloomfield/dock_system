const { check } = require('express-validator')

exports.listarPorId = [
  check('idPessoa')
    .exists().withMessage('O id não pode estar em branco')
    .isInt().withMessage('O id deve ser numérico')
]