//Imports
const express = require('express')
const userCtrl = require('./routes/userCtrl.js')

exports.router = (function () {
    var apiRoute = express.Router()

    //route utilise
    apiRoute.route('/users/register/').post(userCtrl.register)
    apiRoute.route('/users/login/').post(userCtrl.login)

    return apiRoute
})()