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
    }
}