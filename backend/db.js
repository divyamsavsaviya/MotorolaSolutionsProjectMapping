const pg = require('pg');
const {Pool} = pg;

//local postgres database pool
const pool = new Pool ({
    user: 'postgres' ,
    password: 'postgres',
    host: 'localhost',
    post: '5432',
    database: 'postgres',
})

module.exports = pool;