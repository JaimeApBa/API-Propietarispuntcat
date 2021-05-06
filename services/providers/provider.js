var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ================================================
//  GET a list of the providers in a community
// ================================================
app.get('/:cif', authentication.IsLoggedIn, async(req, res) => {
    let data = [req.params.cif];
    let sql = "SELECT p.cif, p.name, p.address, p.postalcode, p.city, p.country, p.email, p.phone, p.latitude, p.longitude, w.role, pf.name AS profession FROM worksto AS w INNER JOIN provider AS p ON  p.cif=w.provider INNER JOIN profession AS pf ON p.profession=pf.id WHERE w.community=?";
    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar els teus proveïdors',
                errors: err
            });
        }
        res.status(200).send({ results: results });
    });
});

// ================================================
//  GET a provider by a string
// ================================================
app.get('/:cif/:string', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        community: req.params.cif,
        string: req.params.string
    };
    let sql = "SELECT p.cif, p.name, p.address, p.postalcode, p.city, p.country, p.email, p.phone, p.latitude, p.longitude, w.role, pf.name AS profession FROM worksto AS w INNER JOIN provider AS p ON  p.cif=w.provider INNER JOIN profession AS pf ON p.profession=pf.id WHERE p.name LIKE ? AND w.community=?";
    await db.query(sql, ['%' + data.string + '%', data.community], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar el teu proveïdor',
                errors: err
            });
        }
        res.status(200).send({ results: results });
    });
});

// ==================================
// Add a provider
// ==================================
app.post('/:cif', authentication.IsLoggedIn, async(req, res) => {

    // data of the provider
    let data = [
        req.body.cif,
        req.body.name,
        req.body.address,
        req.body.postalCode,
        req.body.city,
        req.body.country,
        req.body.email,
        req.body.phone,
        req.body.latitude,
        req.body.longitude,
        req.body.profession,
        req.params.cif,
        4,
        0,
        null
    ];
    //querys to database

    let sql = "CALL createProvider(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    await db.query(sql, data, (err) => {

        if (err && err.errno === 1062) {
            return res.status(400).json({
                message: 'Aquestes dades ja existeixen a la base de dades',
                errors: err
            });
        } else if (err) {
            return res.status(500).json({
                message: 'Error en la base de dades',
                errors: err
            });
        } else {

            res.status(200).send({
                message: 'El proveïdor ha quedat registrada'

            });
        }
    });

});

// ==================================
// Update Role Provider in the Community
// ==================================
app.put('/:provider/:community', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.body.role,
        req.params.community,
        req.params.provider
    ];

    // Set the new role

    let sql = "CALL updateRoleProvider(?,?,?);";
    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut actualitzar el rol d\'aquest proveïdor',
                errors: err
            });
        }
        res.status(200).send({
            message: 'S\'ha actualitzat el rol d\'aquest proveïdor'
        });
    });
});

// ==================================
// Update data of a Provider 
// ==================================
app.put('/:provider', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.body.cif,
        req.body.name,
        req.body.address,
        req.body.postalCode,
        req.body.city,
        req.body.country,
        req.body.email,
        req.body.phone,
        req.body.latitude,
        req.body.longitude,
        req.body.profession,
        req.params.provider
    ];
    console.log(data);
    // Set data

    let sql = "UPDATE provider SET cif=?, name=?, address=?, postalcode=?, city=?, country=?, email=?, phone=?, latitude=?, longitude=?, profession=? WHERE cif=?";
    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut actualitzar aquest proveïdor',
                errors: err
            });
        }
        res.status(200).send({
            message: 'S\'ha actualitzat aquest proveïdor'
        });
    });
});



module.exports = app;