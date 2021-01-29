const db = require('../../data/dbConfig')

module.exports = {findBy, findById, add}

function findBy(filter) {
    return db('users').where(filter).orderBy('id')
}

function findById(id){
    return db('users').where({id}).first()
}

function add(user) {
    const [id] = await db('users').insert(user, 'id')
    return (findById(id))
}