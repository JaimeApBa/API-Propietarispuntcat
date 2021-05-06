var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ==================================
//  GET all professions
// ==================================
app.get('/', authentication.IsLoggedIn, async(req, res) => {

    let sql = "SELECT * FROM profession";
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

// ==================================
//  ADD a profession
// ==================================
app.post('/', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        name: req.body.name
    };

    let sql = "INSERT INTO profession SET ?";
    await db.query(sql, data, (err, results) => {
        if (err && err.errno === 1062) {
            return res.status(400).json({
                message: 'Aquestes dades ja existeixen',
                errors: err
            });
        } else if (err) {
            return res.status(500).json({
                message: 'Error en la base de dades',
                errors: err
            });
        }
        res.status(200).send({
            message: 'Les teves dades s\'han guardat correctament',
        });
    });
});


module.exports = app;