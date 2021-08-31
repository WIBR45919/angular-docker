const express = require('express')
const bodyParser = require('body-parser');
const apiRouter = require('./apiRoutes').router

const APP_PORT = 3000
const MYSQL_PORT = 8080

let server = express()
//Body parser configuration
server.use(bodyParser.urlencoded({ extended: true }))//récupérer les données du body d'une requete
server.use(bodyParser.json())//je le transforme au format json

server.get('/', (request, response) => {
    response.setHeader('Content-Type','text/html')
    response.status(200).send('<h1>Create REST API 👉</h1>')
})

server.use('/api/', apiRouter)

server.listen(APP_PORT, () => {
    console.log('Server stated at port '+ APP_PORT)
})