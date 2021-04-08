var express = require('express');
const db = require('../config/database');
const insertDataUser = require('./insertDataUser');

var authentication = require('../middlewares/authentication');
var app = express();


// ==================================
// Join a community
// ==================================
app.post('/', authentication.IsLoggedIn, (req, res) => {
    console.log(req.params.id);
    req.body.belongsTo = 'pending';
    insertDataUser.insertDataUser(req);
    console.log(res);

});



module.exports = app;