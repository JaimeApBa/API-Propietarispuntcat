var express = require('express');
var bcrypt = require('bcrypt');

const validators = require('../../middlewares/validators');
const db = require('../../config/database');

var authentication = require('../../middlewares/authentication');
var app = express();

// ==================================
// GET one user
// ==================================
app.get('/:id', [authentication.IsLoggedIn], (req, res) => {

    let data = [req.params.id];

    let sql = "SELECT * FROM user WHERE id=?";
    db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(400).json({
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
// Sign up user
// ==================================
app.post('/', [validators.validateUser, validators.validateFields], async(req, res) => {

    let sqlCheck = "SELECT * FROM user WHERE email=?";

    await db.query(sqlCheck, req.body.email, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Hi ha hagut algun error i no s\'ha pogut crear l\'usuari',
                errors: err
            });
        }
        if (result.length) {
            return res.status(400).send({
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
// Update User. No Password
// ==================================
app.put('/:id', [authentication.IsLoggedIn], (req, res) => {

    let data = [
        req.body.name,
        req.body.fullname,
        req.body.phone,
        req.body.email,
        req.params.id
    ];

    let sql = "UPDATE user SET name= ?, fullname= ?, phone= ?, email=? WHERE id= ?";
    db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'No s\'ha pogut actualitzar l\'usuari',
                errors: err
            });
        }
        return res.status(200).send({
            message: 'El teu usuari s\'ha actualitzat'
        });
    });

});

/*
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
*/
module.exports = app;