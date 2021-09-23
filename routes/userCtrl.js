const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils.js');
const models = require('../models/index.js');
const asyncLib = require('async');

// Regex
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*\d).{4,14}$/
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

        if(!EMAIL_REGEX.test(userInfos.email)){
            res.status(400).json({'error' : 'Invalid email'});
        }

        if(!PASSWORD_REGEX.test(userInfos.password)){
            res.status(400).json({'error' : 'Invalid password'});
        }

        //verifier si l'utilisateur exite deja

        models.User.findOne({
            attributes: ['email'], where: { email: userInfos.email }
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
            console.log(error)
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
    },
    getUserProfile: (req,res) => {
        //recupere le token
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        if(userId < 1) res.status(404).json({ 'error': 'wrong token' })

        models.User.findOne({
            attributes: ['id', 'username', 'bio', 'email'], where: { id: userId }
        }).then((userFound) => {
            if(!userFound){
                res.status(404).json({"error":"user not found"})
            }else{
                res.status(201).json(userFound);
            }
        }).catch((err) => {
            res.status(500).json({'error' : 'Internal server  error'})
        })
    },
    updateProfil: (req,res) =>{
        //recupere le token
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        let bio = req.body.bio;
        //verifier si l'id n'est pas null
        if(userId < 0) res.status(404).json({'error': "wrong token"}) 

        //utilisation du Waterfall
        asyncLib.waterfall([
            function (done){
                models.User.findOne({
                    attributes: ['id','bio'], where : { id : userId }
                })
                .then((userFound) =>{
                   done(null, userFound);
                })
                .catch((err) =>{
                    // console.log(err)
                    res.status(500).json({'error' : 'Unable to verify user'})
                });
            },
            function (userFound, done) { 
                if(userFound){
                    // console.error(userFound)
                    userFound.update({
                        bio: (bio ? bio : userFound.bio)
                    }).then(() =>{
                        done(userFound);
                    }).catch((err)=>{
                        res.status(500).json({'error' : 'Cannot update user'});
                    });
                }else{
                    res.status(404).json({'error' : 'user not found'});
                }
             },
        ], (user) => {
            if(user){
                res.status(200).json(user);
            }else{
                res.status(500).json({'error' : 'Cannot update user profile'});
            }
        })
    }
}