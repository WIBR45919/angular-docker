const jwt = require('jsonwebtoken');
const JWT_SIGN_TOKEN = '09ekvlci xnwioayplmzmoabpqlxhbcosapm4a849c84a9casca'
module.exports = {
    generateToken: (userData) =>{
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin,
            username: userData.username
        },JWT_SIGN_TOKEN,
        {
            expiresIn: '1h'
        })
    },
    parseAutorization: (authorization) => {
        return authorization !== null ? authorization.replace('Bearer ',''): '';
    },
    getUserId: (authorization) =>{
        userId = -1;
        var token = module.exports.parseAutorization(authorization);
        if(token !== null){
            try{
                let jwtToken = jwt.verify(token, JWT_SIGN_TOKEN);
                if(jwtToken !== null) userId = jwtToken.userId

            }catch(err){ }
        }

        return userId;
    }
}