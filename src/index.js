const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true} ))

app.get('/', (req, res) => {
  res.send('<h1>Olá mundo!</h1>')
})

const pessoaRouter = require('./routes/pessoaRouter')
app.use('/api/v1/pessoas', pessoaRouter)

const contaRouter = require('./routes/contaRouter')
app.use('/api/v1/contas', contaRouter)

const apiRouter = require('./routes/apiRouter')
app.use('/api/v1/auth', apiRouter)

const port = process.env.PORT
app.listen(port, () => { console.log(`Servidor rodando na porta ${port}`) })