//imports
const models = require('../models/index.js');
const jwtUtils = require('../utils/jwt.utils.js');
const asyncLib = require('async');

//constants
const LIKED = 1;
const DISLIKED = 0
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
                    }).then(function(UserAlreadyLikedFound){
                        done(null, message, user, UserAlreadyLikedFound);
                    }).catch((err)=>{
                        res.status(500).json({'error': 'unable to verify this if user already liked'})
                    })
                }else{
                    res.status(404).json({'error':'user not found'});
                }
            },
            (messageFound, userFound, UserAlreadyLikedFound, done)=>{
                if(!UserAlreadyLikedFound){
                    messageFound.addUser(userFound, { isLike: LIKED }).
                    then((AlreadyLikeFound)=>{
                        done(null, messageFound, userFound, UserAlreadyLikedFound);
                    }).catch((err)=>{
                        res.status(500).json({'error': 'unabled to set user reaction'})
                    })
                }else{
                    if(UserAlreadyLikedFound.isLike === DISLIKED){
                        UserAlreadyLikedFound.update({
                            isLike: LIKED,
                        }).then(()=>{
                            done(null, messageFound, userFound);
                        }).catch((err)=>{
                            res.status(500).json({'error': 'cannot update user reaction'})
                        })
                    }
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
                    }).then(function(UserAlreadyLikedFound){
                        done(null, message, user, UserAlreadyLikedFound);
                    }).catch((err)=>{
                        res.status(500).json({'error': 'unable to verify this if user already disliked'})
                    })
                }else{
                    res.status(404).json({'error':'user not found'});
                }
            },
            (messageFound, userFound, UserAlreadyLikedFound, done)=>{
                if(!UserAlreadyLikedFound){
                    messageFound.addUser(userFound, { isLike: DISLIKED }).
                    then(()=>{
                        done(null, messageFound, userFound);
                    }).catch((err)=>{
                        res.status(500).json({'error': 'cannot remove already liked post'})
                    })
                }else{
                    if(UserAlreadyLikedFound.isLike === LIKED){
                        UserAlreadyLikedFound.update({
                            isLike: DISLIKED,
                        }).then(()=>{
                            done(null, messageFound, userFound);
                        }).catch((err)=>{
                            res.status(500).json({'error': 'cannot update user reaction'})
                        })
                    }
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