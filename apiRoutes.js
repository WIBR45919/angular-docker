//Imports
const express = require('express')
const userCtrl = require('./routes/userCtrl.js')
const messageCtrl = require('./routes/messageCtrl.js');

exports.router = (function () {
    var apiRoute = express.Router()

    //user route utilise
    apiRoute.route('/users/register/').post(userCtrl.register)
    apiRoute.route('/users/login/').post(userCtrl.login)
    apiRoute.route('/users/me/').get(userCtrl.getUserProfile)
    apiRoute.route('/users/me/').put(userCtrl.updateProfil)

    //message route utilise
    apiRoute.route('/message/post/').post(messageCtrl.postMessage)
    apiRoute.route('/message/list/').post(messageCtrl.listMessages)
    

    return apiRoute
})()