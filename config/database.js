const mysql = require('mysql');
require('dotenv').config();

// ==================================
// Database data connection
// ==================================
const connection = mysql.createPool({
    host: process.env.HOST_PROD,
    user: process.env.USER_PROD,
    password: process.env.PASSWORD_PROD,
    database: process.env.DATABASE_PROD

});

// ==================================
// Connect to database
// ==================================


module.exports = connection;
