const conexao = require('../config/conexao')
const { validationResult } = require('express-validator')

function obterConta(idConta, callbackFunction) {
  const query = 'select * from contas where idConta = ?'

  conexao.query(query, [idConta], (err, result) => callbackFunction(err, result))
}

function gravaTransacao(idTipoTransacao, idConta, valor, callbackFunction) {
  const query = 'insert into transacoes (idTipoTransacao, idConta, valor) values (?, ?, ?)'

  return conexao.query(query, [idTipoTransacao, idConta, valor], (err, result) => callbackFunction(err, result))
}

function realizaDeposito(req, res, transacao) {
  const query = 'update contas set saldo = saldo + ? where idConta = ?'

  conexao.query(query, [transacao.valor, transacao.idConta], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (result.affectedRows > 0) {
      res.status(200)
      res.json({ "message": "Depósito realizado com sucesso" })
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  })
}

function realizaSaque(transacao, res) {
  const query = 'update contas set saldo = saldo - ? where idConta = ?'

  conexao.query(query, [transacao.valor, transacao.idConta], (errQuery, resultQuery) => {
    if (errQuery) {
      console.log(errQuery)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (resultQuery.affectedRows > 0) {
      res.status(200)
      res.json({ "message": "Saque realizado com sucesso" })
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  })
}

function setFlagAtivo(flagAtivo, idConta, msg, res) {
  const query = 'update contas set flagAtivo = ? where idConta = ?'

  conexao.query(query, [flagAtivo, idConta], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (result.affectedRows > 0) {
      res.status(200)
      res.json({ "message": msg })
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  })
}

function executaExtratoCompleto(res, idConta) {
  const query = `SELECT t.valor, t.dataTransacao, tt.descricao FROM contas c
                  INNER JOIN transacoes t ON t.idConta = c.idConta
                  INNER JOIN tipo_transacao tt ON tt.idTipoTransacao = t.idTipoTransacao
                  WHERE c.flagAtivo = 1
                  AND c.idConta = ?`

  conexao.query(query, [idConta], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (result[0]) {
      res.status(200)
      res.json(result)
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  });
}

function executaExtratoPorPeriodo(res, idConta, dataInicial, dataFinal) {
  const query = `SELECT t.valor, t.dataTransacao, tt.descricao FROM contas c
                  INNER JOIN transacoes t ON t.idConta = c.idConta
                  INNER JOIN tipo_transacao tt ON tt.idTipoTransacao = t.idTipoTransacao
                  WHERE c.flagAtivo = 1
                  AND c.idConta = ?
                  AND (t.dataTransacao BETWEEN ? AND ?)`

  conexao.query(query, [idConta, dataInicial, dataFinal], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (result[0]) {
      res.status(200)
      res.json(result)
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  });
}

exports.listar = (req, res) => {
  let descricao = req.query.f || ""
  descricao = "%" + descricao + "%"

  const query = "select * from contas"

  conexao.query(query, [descricao], (err, rows) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (rows.length > 0) {
      res.status(200)
      res.json(rows)
    } else {
      res.status(404)
      res.json({ "message": "Nenhuma conta cadastrada para esta busca" })
    }
  })
}

exports.listarPorId = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const idConta = req.params.idConta

  obterConta(idConta, (err, result) => {
    console.log(result)
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (result.length > 0) {
      res.status(200)
      res.json(result)
    } else {
      res.status(404)
      res.json({ "message": "Nenhuma conta cadastrada para esta busca" })
    }
  })
}

exports.inserir = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const conta = {}

  conta.idPessoa = req.body.idPessoa
  conta.saldo = req.body.saldo
  conta.limiteSaqueDiario = req.body.limiteSaqueDiario
  conta.tipoConta = req.body.tipoConta

  const query = `insert into contas
                  (
                    idPessoa,
                    saldo,
                    limiteSaqueDiario,
                    tipoConta
                  ) values (
                    ?, ?, ?, ?
                  )`;

  conexao.query(
    query,
    [
      conta.idPessoa,
      conta.saldo,
      conta.limiteSaqueDiario,
      conta.tipoConta
    ], (err, result) => {
      if (err) {
        console.log(err)
        res.status(500)
        res.json(
          { "message": "Internal Server Error" }
        );
      } else {
        conta.idConta = result.insertId
        res.status(201)
        res.json(
          {
            "message": "Conta cadastrada com sucesso",
            "conta": conta
          }
        )
      }
    })
}

exports.deposito = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const transacao = {}
  transacao.idConta = req.body.idConta
  transacao.idTipoTransacao = 1 // Depósito
  transacao.valor = req.body.valor

  obterConta(transacao.idConta, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (!!result[0]) {
      const contaConsultada = result[0];
      if (parseInt(contaConsultada.flagAtivo) === 1) {
        gravaTransacao(transacao.idTipoTransacao, transacao.idConta, transacao.valor, (errTransacao, resultTRansacao) => {
          if (errTransacao) {
            console.log(errTransacao)
            res.status(500)
            res.json({ "message": "Internal Server Error" })
          } else if (resultTRansacao.affectedRows > 0) {
            realizaDeposito(req, res, transacao);
          } else {
            res.status(403)
            res.json({ "message": "Transacao não encontrada" })
          }
        })
      } else {
        res.status(402)
        res.json({ "message": "Conta bloqueada" })
      }
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  })

}

exports.saque = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const transacao = {}
  transacao.idConta = req.body.idConta
  transacao.idTipoTransacao = 2 // Saque
  transacao.valor = req.body.valor

  obterConta(transacao.idConta, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (!!result[0]) {
      const contaConsultada = result[0];
      if (parseInt(contaConsultada.flagAtivo) === 1) {
        if (parseFloat(contaConsultada.saldo) > parseFloat(transacao.valor)) {
          gravaTransacao(transacao.idTipoTransacao, transacao.idConta, transacao.valor, (errTransacao, resultTRansacao) => {
            if (errTransacao) {
              console.log(errTransacao)
              res.status(500)
              res.json({ "message": "Internal Server Error" })
            } else if (resultTRansacao.affectedRows > 0) {
              realizaSaque(transacao, res);
            } else {
              res.status(404)
              res.json({ "message": "Transacao não encontrada" })
            }
          })
        } else {
          res.status(403)
          res.json({ "message": "Saldo insuficiente" })
        }
      } else {
        res.status(402)
        res.json({ "message": "Conta bloqueada" })
      }
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  });
}

exports.bloquear = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const idConta = req.params.idConta
  const flagAtivo = 0;
  const msg = "Conta bloqueada com sucesso"

  setFlagAtivo(flagAtivo, idConta, msg, res)
}

exports.desbloquear = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const idConta = req.params.idConta
  const flagAtivo = 1;
  const msg = "Conta desbloqueada com sucesso"

  setFlagAtivo(flagAtivo, idConta, msg, res)
}

exports.extratoCompleto = (req, res) => {
  const idConta = req.params.idConta

  obterConta(idConta, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (!!result[0]) {
      const contaConsultada = result[0];
      if (parseInt(contaConsultada.flagAtivo) === 1) {
        executaExtratoCompleto(res, idConta);
      } else {
        res.status(402)
        res.json({ "message": "Conta bloqueada" })
      }
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  })

}

exports.extratoPorPeriodo = (req, res) => {
  const idConta = req.params.idConta
  const dataInicial = req.body.dataInicial
  const dataFinal = req.body.dataFinal

  obterConta(idConta, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (!!result[0]) {
      const contaConsultada = result[0];
      if (parseInt(contaConsultada.flagAtivo) === 1) {
        executaExtratoPorPeriodo(res, idConta, dataInicial, dataFinal);
      } else {
        res.status(402)
        res.json({ "message": "Conta bloqueada" })
      }
    } else {
      res.status(404)
      res.json({ "message": "Conta não encontrada" })
    }
  })
}
