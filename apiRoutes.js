//Imports
import { Router } from 'express'
import { method } from './routes/userCtrl.js'

export const router = (function () {
    var apiRoute = Router()

    //route utilise
    apiRoute.route('/users/register/').post(method.register)
    apiRoute.route('/users/login/').post(method.login)

    return apiRoute
})()