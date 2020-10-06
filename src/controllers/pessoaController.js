const conexao = require('../config/conexao')

exports.listar = (req, res) => {
  let descricao = req.query.f || ""
  descricao = "%" + descricao + "%"

  const query = "select * from pessoas"

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
      res.json({ "message": "Nenhuma pessoa cadastrada para esta busca" })
    }
  })
}

exports.listarPorId = (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  } else {

    const id = req.params.id

    const query = 'select * from pessoas where idPessoa = ?'

    conexao.query(query, [id], (err, rows) => {
      if (err) {
        console.log(err)
        res.status(500)
        res.json({ "message": "Internal Server Error" })
      } else if (rows.length > 0) {
        res.status(200)
        res.json(rows[0])
      } else {
        res.status(404)
        res.json({ "message": "Nenhuma pessoa cadastrada com esse id" })
      }
    })
  }
}

exports.inserir = (req, res) => {

  const pessoa = {}

  pessoa.nome = req.body.nome
  pessoa.cpf = req.body.cpf
  pessoa.dataNascimento = req.body.dataNascimento

  const query = 'insert into pessoas (nome, cpf, dataNascimento) values (?, ?, ?)'

  conexao.query(
    query,
    [
      pessoa.nome,
      pessoa.cpf,
      pessoa.dataNascimento
    ], (err, result) => {
      if (err) {
        console.log(err)
        res.status(500)
        res.json(
          { "message": "Internal Server Error" }
        );
      } else {
        pessoa.idPessoa = result.insertId
        res.status(201)
        res.json(
          {
            "message": "Pessoa cadastrada com sucesso",
            "pessoa": pessoa
          }
        )
      }
    })
}

exports.alterar = (req, res) => {

  const pessoa = {}
  pessoa.idPessoa = req.params.id
  pessoa.nome = req.body.nome
  pessoa.cpf = req.body.cpf
  pessoa.dataNascimento = req.body.dataNascimento

  const query = 'update pessoas set nome = ?, cpf = ?, dataNascimento = ? where idPessoa = ?'

  conexao.query(query, [pessoa.nome, pessoa.cpf, pessoa.dataNascimento, pessoa.idPessoa], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (result.affectedRows > 0) {
      res.status(202)
      res.json(
        {
          "message": "Pessoa alterada com sucesso",
          "pessoa": pessoa
        }
      )
    } else {
      res.status(404)
      res.json({ "message": "Pessoa não encontrada" })
    }
  })
}

exports.deletar = (req, res) => {

  const idPessoa = req.params.idPessoa

  const query = 'update pessoas set flagAtivo = 0 where idPessoa = ?'

  conexao.query(query, [idPessoa], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ "message": "Internal Server Error" })
    } else if (result.affectedRows > 0) {
      res.status(200)
      res.json(
        {
          "message": "Pessoa excluída com sucesso"
        }
      )
    } else {
      res.status(404)
      res.json({ "message": "Pessoa não encontrada" })
    }
  })
}