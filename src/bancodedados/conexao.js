
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST, 
        port: process.env.DB_PORT, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD, 
        database: process.env.DB_DATABASE 
    }
})

const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost', 
    port: 5432, 
    user: 'postgres', 
    password: 'postgres', 
    database: 'dindin' 
})

const query = (text, param) => {
    return pool.query(text, param)

}


module.exports = {
    knex,
    query
}