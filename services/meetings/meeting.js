var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ================================================
//  GET a list of the meetings in a community
// ================================================
app.get('/:cif', authentication.IsLoggedIn, async(req, res) => {
    let data = [req.params.cif];

    let sql = "SELECT * FROM meeting as m WHERE m.community=?";


    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al connectar amb la base de dades',
                errors: err
            });
        }
        res.status(200).send({ results: results });
    });
});

// ================================================
//  GET a meeting by a string
// ================================================
app.get('/:cif/:string', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        community: req.params.cif,
        string: req.params.string
    };
    let sql = "SELECT * FROM meeting as m WHERE m.description LIKE ? AND m.community=?";
    await db.query(sql, ['%' + data.string + '%', data.community], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar la junta',
                errors: err
            });
        }
        res.status(200).send({ results: results });
    });
});

// ================================================
//  POST an meeting in a community
// ================================================
app.post('/', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        description: req.body.description,
        date: req.body.date,
        place: req.body.place,
        community: req.body.community
    };

    let sql = "INSERT INTO meeting SET ?";

    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al connectar amb la base de dades',
                errors: err
            });
        }
        res.status(200).send({
            message: 'La junta s\'ha creat correctament',
        });
    });
});

// ====================================================================
// Update a meeting from a community
// ====================================================================

app.put('/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.body.description,
        req.body.date,
        req.body.place,
        req.params.id
    ];

    let sql = "UPDATE meeting SET description=?, date=?, place=? WHERE id=?";

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
// Remove a meeting from a community
// ====================================================================

app.delete('/:cif/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.params.id,
        req.params.cif
    ];

    let sql = "DELETE FROM meeting WHERE id=? AND community=?";

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