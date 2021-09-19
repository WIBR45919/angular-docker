import express from 'express';
import bcrypt from 'bcrypt';

//Routes propres aux utilisateurs

export let method = {
    register: (req, res) => {
        let userInfos = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio,
        }

        if (userInfos.email == null ||userInfos.username == null || userInfos.password == null){
            return res.status(400).json({'error': 'missing parameter'})
        }

        //verifier si l'utilisateur exite deja

        models.User.findOne({
            attributes: ['email'], where : { email: userInfos.email }
        }).then(function(userFound){
            if(!userFound){
                bcrypt.hash(userInfos.password, 5, function (error, bcryptedPassword) {
                    let newUser = models.User.create({
                        ...userInfos,
                        password: bcryptedPassword,
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

    }
}