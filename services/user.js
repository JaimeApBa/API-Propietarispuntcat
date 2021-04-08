var express = require('express');
var bcrypt = require('bcrypt');

const validators = require('../middlewares/validators');
const db = require('../config/database');

var authentication = require('../middlewares/authentication');
var app = express();

// ==================================
//  GET a list of users
// ==================================
app.get('/', [authentication.IsLoggedIn], (req, res) => {
    //console.log(req.userData);
    let sql = "SELECT * FROM user";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar usuaris',
                errors: err
            });
        }
        res.send({ results: results });
    });
});

// ==================================
// GET one user
// ==================================
app.get('/:id', [authentication.IsLoggedIn], (req, res) => {

    let data = [req.params.id];

    let sql = "SELECT * FROM user WHERE id=?";
    db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'L\'usuari no existeix',
                errors: err
            });
        }
        res.status(200).send({
            results: results
        });
    });

});

// ==================================
// Add a user
// ==================================
app.post('/', [validators.validateUser, validators.validateFields], (req, res) => {

    let sqlCheck = "SELECT * FROM user WHERE email=?";

    db.query(sqlCheck, req.body.email, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Hi ha hagut algun error i no s\'ha pogut crear l\'usuari',
                errors: err
            });
        }
        if (result.length) {
            return res.status(409).send({
                message: 'Aquest usuari ja existeix'
            });
        } else {
            const salt = bcrypt.genSaltSync();

            let data = {
                id: req.body.id,
                name: req.body.name,
                fullname: req.body.fullname,
                phone: req.body.phone,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, salt)
            };

            let sql = "INSERT INTO user SET ?";

            db.query(sql, data, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: 'No s\'ha pogut crear l\'usuari',
                        errors: err
                    });
                }

                return res.status(200).send({
                    message: 'T\'has enregistrat correctament'
                });
            });

        }

    });
});

// ==================================
// Update User. No Email and Password
// ==================================
app.put('/:id', [authentication.IsLoggedIn], (req, res) => {

    let data = [
        req.body.name,
        req.body.fullname,
        req.body.phone,
        req.params.id
    ];

    let sql = "UPDATE user SET name= ?, fullname= ?, phone= ? WHERE id= ?";
    db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'No s\'ha pogut esborrar l\'usuari',
                errors: err
            });
        }
        return res.status(200).send({
            message: 'El teu usuari s\'ha actualitzat'
        });
    });

});

// ==================================
// Delete User
// ==================================
app.delete('/:id', [authentication.IsLoggedIn], (req, res) => {

    let data = [req.params.id];

    let sql = "DELETE FROM user WHERE id= ?";
    db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'No s\'ha pogut actualitzar l\'usuari',
                errors: err
            });
        }
        res.send({ "status": 200, "error": null, "response": results });
    });
});

module.exports = app;