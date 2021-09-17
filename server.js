const express = require('express');//framework permettant la creation d'un serveur Web
const bodyParser = require('body-parser');//analyser le corps de la requete afin de recuperer les params
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
    console.log('Server started at port '+ APP_PORT)
})