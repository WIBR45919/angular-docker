const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils.js');
const models = require('../models/index.js');
//Routes propres aux utilisateurs

module.exports = {
    register: (req, res, next) => {
        let userInfos = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio
        }

        if (userInfos.email == null ||userInfos.username == null || userInfos.password == null){
            return res.status(400).json({'error': 'missing parameter'})
        }

        if(userInfos.username.length >= 13 || userInfos.username.length <= 4){
            return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)'});
        }

        //verifier si l'utilisateur exite deja

        models.User.findOne({
            attributes: ['email', 'username'], where : { email: userInfos.email, username: userInfos.username }
        }).then(function(userFound){
            if(!userFound){
                bcrypt.hash(userInfos.password, 5, function (error, bcryptedPassword) {
                    let newUser = models.User.create({
                        email: userInfos.email,
                        username: userInfos.username,
                        password: bcryptedPassword,
                        bio: userInfos.bio,
                        isAdmin: 0
                    })
                    .then(function(newUser){
                        return res.status(201).json({'userId': newUser.id})
                    }).catch(function(err){
                        return res.status(500).json({'error': 'cannot add user' })
                    })
                 })
            }else{
                return res.status(409).json({'error': 'user already exist' });
            }
        }).catch(function(error){
            return res.status(500).json({ 'error': 'unable to verify user' });
        });

    },
    login: (req, res)=>{
        let logUser = {
            password: req.body.password,
            email: req.body.email
        }

        //verification d'existance
        
        if(logUser.email == null || logUser.password == null){
            return res.status(400).json({ 'error': 'missing parameters'});
        }

        models.User.findOne({
            where: { email: logUser.email }
        }).then((userFound) => {
            if(userFound){
                bcrypt.compare(logUser.password, userFound.password, (err, encryptedPasword) => {
                   if(encryptedPasword){
                    res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateToken(userFound)
                    })
                   }else{
                       res.status(403).json({ 'error' : 'Invalid password'})
                   }
                })
            }else{
                res.status(404).json({ 'error': 'user not exist in BD'});
            }
        }).catch((err) =>{
            res.status(500).json({ 'error' : 'Internal server error'});
        })
    }
}