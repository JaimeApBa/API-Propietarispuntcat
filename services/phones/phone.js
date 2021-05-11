var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ==================================
//  GET all phones
// ==================================
app.get('/:cif', authentication.IsLoggedIn, async(req, res) => {

    let data = [req.params.cif];

    let sql = "SELECT * FROM phone AS p  WHERE p.community=?";

    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error en la base de dades',
                errors: err
            });
        }
        res.status(200).send({ results: results });
    });
});

// ================================================
//  GET a phone by a string
// ================================================
app.get('/:cif/:string', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        community: req.params.cif,
        string: req.params.string
    };
    let sql = "SELECT * FROM phone AS p  WHERE p.name LIKE ? AND p.community=?";
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
//  ADD a phone
// ==================================
app.post('/:cif', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        name: req.body.name,
        numberphone: req.body.numberphone,
        community: req.params.cif
    };

    let sql = "INSERT INTO phone SET ?";
    await db.query(sql, data, (err, results) => {

        if (err && err.errno === 1062) {
            return res.status(400).json({
                message: 'Aquestes dades ja existeixen',
                errors: err
            });
        } else if (err && err.errno !== 1062) {
            return res.status(500).json({
                message: 'Error en la base de dades',
                errors: err
            });
        } else {
            res.status(200).send({
                message: 'Les teves dades s\'han guardat correctament',
            });
        }

    });
});

// ====================================================================
// Update a phone from a community
// ====================================================================

app.put('/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.body.name,
        req.body.numberphone,
        req.params.id
    ];
    let sql = "UPDATE phone SET name=?, numberphone=? WHERE id=?";

    await db.query(sql, data, (err) => {
        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut realitzar la operació'
            });
        }

        res.status(200).send({ message: 'La teva petició s\'ha realitzat correctament' });
    });

});

// ====================================================================
// Remove a phone from a community
// ====================================================================

app.delete('/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.params.id
    ];

    let sql = "DELETE FROM phone WHERE id=?";

    await db.query(sql, data, (err) => {

        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut realitzar la operació'
            });
        }

        res.status(200).send({ message: 'La teva petició s\'ha realitzat correctament' });
    });

});



module.exports = app;