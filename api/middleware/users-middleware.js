const dbConfig = require('../../data/dbConfig')
const User = require('../auth/user-model')
const db = require('../../data/dbConfig')

function isValid(user) {
    return Boolean(user.username && user.password && typeof user.password === 'string')
}

function uniqueUser(req, res, next) {
    const user = User.findBy(req.body.username)

    return user.length ? res.status(401).json({message: 'username taken'}) : next()   
}


module.exports = {isValid, uniqueUser}