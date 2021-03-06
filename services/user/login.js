var express = require('express');
var bcrypt = require('bcrypt');
require('dotenv').config();
var authenticacion = require('../../middlewares/authentication');
const db = require('../../config/database');


var app = express();

// ==================================
// Authentication
// ==================================

app.post('/', async(req, res) => {

    let data = [req.body.email];

    let sql = "SELECT * FROM user WHERE email=?";
    // make the query to database
    await db.query(sql, data, (err, results) => {
        // message in case of any error
        if (err) {
            return res.status(400).send({
                message: 'Error en la validació de l\'usuari'
            });
        }
        // message if user doen't exist in database
        if (!results.length) {
            return res.status(401).send({
                message: 'No hem trobat cap usuari amb aquestes credencials',
            });
        }
        // check if password is correct
        if (!bcrypt.compareSync(req.body.password, results[0].password)) {
            return res.status(401).send({
                message: 'La contrasenya és incorrecte',
            });
        }
        // create token
        let payload = {
            "id": results[0].id,
            "name": results[0].name,
            "fullname": results[0].fullname,
        };

        var token = authenticacion.generateToken(payload);

        res.status(200).send({
            user: results[0],
            token: token
        });
    });

});

module.exports = app;