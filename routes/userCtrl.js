const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Routes propres aux utilisateurs

module.export = {
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
    },
    login: (req, res)=>{
    }
}