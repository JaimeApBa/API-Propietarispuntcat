var express = require('express');
var bcrypt = require('bcrypt');
const db = require('../../config/database');

var app = express();


// ==================================
// Update Password of a User
// ==================================
app.put('/', (req, res) => {
    const salt = bcrypt.genSaltSync();

    let data = [
        bcrypt.hashSync(req.body.password, salt),
        req.body.email
    ];

    let sql = "UPDATE user SET password= ? WHERE email= ?";
    db.query(sql, data, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: 'Hi ha hagut algun problema i no s\'ha pogut actualitzar l’usuari',
                errors: err
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: 'Aquest usuari no existeix',
            });
        } else {
            return res.status(200).send({
                message: 'La teva contrasenya s\'ha actualitzat'
            });
        }
    });

});

module.exports = app;