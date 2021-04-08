const mysql = require('mysql');
require('dotenv').config();

// ==================================
// Database data connection
// ==================================
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE

});

// ==================================
// Connect to database
// ==================================
connection.connect();

module.exports = connection;