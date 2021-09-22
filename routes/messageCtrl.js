//import
const models = require('../models/index.js')
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils.js');


//routes
module.exports = {
    postMessage: (req, res)=>{
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        if(userId < 1) res.status(404).json({ 'error': 'wrong token' })

        //recuperation des params
        const message = {
            title: req.body.title,
            content: req.body.content,
        }

        //verification du contenu

        if(message.title == null || message.title.length <= 5){
            res.status(400).json({'error':'Invalid parameters'});
        }

        if(message.content == null || message.content.length <= 10){
            res.status(400).json({'error':'Invalid parameters'});
        }

        //watterfall 
        asyncLib.waterfall([
           (done)=>{
            models.User.findOne({
                where: { id: userId}
            }).then((userFound)=>{
                done(null, userFound)
            }).catch((err)=>{
                res.status(500).json({'error': 'Unable to verify user'})
            })
           },
           (userFound, done)=>{
               if(userFound){
                     let newMessage = models.Message.create({
                         title: message.title,
                         content: message.content,
                         likes: 0,
                         UserId: userFound.id
                     }).then((newMessage) => {
                         done(newMessage);
                     }).catch((err)=>{
                         console.log(err);
                         res.status(500).json({'error': 'cannot post message'})
                     })
               }else{
                   res.status(404).json({'error': 'User not found'});
               }
           }
        ], (newMessage)=>{
            if(newMessage){
                res.status(201).json(newMessage);
            }
            res.status(500).json({'error': 'Message can be create'})
        })
    },
    listMessages: (req, res)=>{
        let fields = req.query.fields;
        let limit = parseInt(req.query.limit);
        let  offset = parseInt(req.query.offset);
        let order = req.query.order;

        console.log(fields);
        models.Message.findAll({
            order: [(order != null) ? order.split(':'): ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(','): null,
            limit: !isNaN(limit) ? limit : null,
            offset: (!isNaN(offset) ? offset : null),
            include:[{
                model: models.User,
                attributes: ['username']
            }]
        }).then((messages)=>{
            if(messages){
                res.status(200).json(messages);
            }else{
                res.status(404).json({'error' : 'no message found'});
            }
        }).catch((error)=>{
            res.status(500).json({'error' : 'Internal server error'})
        })
    }
}