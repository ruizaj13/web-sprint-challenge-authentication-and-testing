const dbConfig = require('../../data/dbConfig')
const User = require('../auth/user-model')
const db = require('../../data/dbConfig')

function isValid(user) {
    return Boolean(user.username && user.password && typeof user.password === 'string')
}

async function uniqueUser(req, res, next) {
    const user = await User.findBy({username: req.body.username})

    !user.length ? next() :  res.status(401).json('username taken')
}


module.exports = {isValid, uniqueUser}