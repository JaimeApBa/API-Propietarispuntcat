var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ==================================
//  GET all the states
// ==================================
app.get('/', authentication.IsLoggedIn, async(req, res) => {

    let sql = "SELECT * FROM workstate";
    await db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error en la base de dades',
                errors: err
            });
        }
        res.status(200).send({ results: results });
    });
});


module.exports = app;