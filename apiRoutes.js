//Imports
const express = require('express')
const api = require('./routes/userCtrl')

exports.router = (function () {
    var apiRoute = express.Router()

    //route utilise
    apiRoute.route('/users/register/').post(()=>{})
    apiRoute.route('/users/login/').post(()=>{})

    return apiRoute
})()