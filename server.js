import express from 'express';//framework permettant la creation d'un serveur Web
import { router as apiRouter } from './apiRoutes.js';

const APP_PORT = 3000
const MYSQL_PORT = 8080

let server = express()
//Body parser configuration
server.use(express.urlencoded({ extended: true }))//récupérer les données du body d'une requete
server.use(express.json())//je le transforme au format json

server.get('/', (request, response) => {
    response.setHeader('Content-Type','text/html')
    response.status(200).send('<h1>Create REST API 👉</h1>')
})

server.use('/api/', apiRouter)

server.listen(APP_PORT, () => {
    console.log('Server started at port '+ APP_PORT)
})