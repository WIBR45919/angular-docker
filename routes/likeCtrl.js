//imports
const models = require('../models/index.js');
const jwtUtils = require('../utils/jwt.utils.js');
const asyncLib = require('async');

//imports

module.exports = {
    likePost: (req, res)=>{
        let headerAuth = req.headers['authorization'];
        let UserId = jwtUtils.getUserId(headerAuth);
        if(UserId < 1) res.status(404).json({ 'error': 'wrong token' })

        //recuperation des params
        let messageId = parseInt(req.params.messageId)

        if(messageId <= 0){
            res.status(400).json({'error' : 'Invalid parameters'})
        }

        //watterfall
        asyncLib.waterfall([
            (done)=>{
                models.Message.findOne({
                    where: { id: messageId }
                }).then(function(message){
                    done(null,message);
                }).catch((err)=>{
                    res.status(500).json({'error':'Unable to find this message'})
                })
            },
            (message, done)=>{
                if(message){
                    models.User.findOne({
                        where: { id: UserId }
                    }).then(function(user){
                        done(null, message, user);
                    }).catch((err)=>{
                        res.status(500).json({'error':'cannot find user'})
                    })
                }else{
                    res.status(404).json({'error':'post already like'});///////verify--------
                }
            },
            (message, user, done)=>{
                if(user){
                    models.Like.findOne({
                        where : {
                            userId: UserId,
                            messageId: messageId
                        }
                    }).then(function(isAlreadyLike){
                        done(null, message, user, isAlreadyLike);
                    }).catch((err)=>{
                        res.status(500).json({'error': 'unable to verify this if user already liked'})
                    })
                }else{
                    res.status(404).json({'error':'user not found'});
                }
            },
            (messageFound, userFound, isAlreadyLike, done)=>{
                if(!isAlreadyLike){
                    messageFound.addUser(userFound).
                    then((AlreadyLikeFound)=>{
                        done(null, messageFound, userFound, isAlreadyLike);
                    }).catch((err)=>{
                        res.status(500).json({'error': 'unabled to set user reaction'})
                    })
                }else{
                    res.status(409).json({'error': 'message already liked'})
                }
            },
            (messageFound, userFound, isAlreadyLike, done)=>{
                messageFound.update({
                    likes: messageFound.likes + 1
                }).then(()=>{
                    done(messageFound)
                }).catch((err)=>{
                    res.status(500).json({'error':'cannot liked'})
                })
            }
        ], (newMessage)=>{
            if(newMessage){
                res.status(201).json(newMessage);
            }else{
                res.status(400).json({'error': 'update failed'})
            }
        })
    },
    dislikePost: (req, res)=>{
        let headerAuth = req.headers['authorization'];
        let UserId = jwtUtils.getUserId(headerAuth);
        if(UserId < 1) res.status(404).json({ 'error': 'wrong token' })

        //recuperation des params
        let messageId = parseInt(req.params.messageId)

        if(messageId <= 0){
            res.status(400).json({'error' : 'Invalid parameters'})
        }

        //watterfall
        asyncLib.waterfall([
            (done)=>{
                models.Message.findOne({
                   attributes: ['id','like'], where: { id: messageId }
                }).then(function(message){
                    done(null,message);
                }).catch((err)=>{
                    res.status(500).json({'error':'Unable to find this message'})
                })
            },
            (message, done)=>{
                if(message){
                    models.User.findOne({
                        where: { id: UserId }
                    }).then(function(user){
                        done(null, message, user);
                    }).catch((err)=>{
                        res.status(500).json({'error':'cannot find user'})
                    })
                }else{
                    res.status(404).json({'error':'post already dislike'});///////verify--------
                }
            },
            (message, user, done)=>{
                if(user){
                    models.Like.findOne({
                        where : {
                            userId: UserId,
                            messageId: messageId
                        }
                    }).then(function(isAlreadyLike){
                        done(null, message, user, isAlreadyLike);
                    }).catch((err)=>{
                        res.status(500).json({'error': 'unable to verify this if user already disliked'})
                    })
                }else{
                    res.status(404).json({'error':'user not found'});
                }
            },
            (messageFound, userFound, isAlreadyLike, done)=>{
                if(!isAlreadyLike){
                    messageFound.destroy().
                    then(()=>{
                        done(null, messageFound, userFound);
                    }).catch((err)=>{
                        res.status(500).json({'error': 'cannot remove already liked post'})
                    })
                }else{
                    done(null, messageFound, userFound);
                }
            },
            (messageFound, userFound, done)=>{
                messageFound.update({
                    likes: messageFound.likes - 1
                }).then(()=>{
                    done(messageFound)
                }).catch((err)=>{
                    res.status(500).json({'error':'cannot disliked'})
                })
            }
        ], (newMessage)=>{
            if(newMessage){
                res.status(201).json(newMessage);
            }else{
                res.status(400).json({'error': 'update failed'})
            }
        })
    }
}