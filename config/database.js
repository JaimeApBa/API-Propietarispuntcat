const mysql = require('mysql');
require('dotenv').config();

// ==================================
// Database data connection
// ==================================
const connection = mysql.createPool({
    host: process.env.HOST,
    user: 'username',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE

});

// ==================================
// Connect to database
// ==================================


module.exports = connection;