var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ================================================
//  GET a list of the refurbishment in a community
// ================================================
app.get('/:cif', authentication.IsLoggedIn, async(req, res) => {
    let data = [req.params.cif];
    // let sql = "SELECT r.id, r.description, p.cif AS provider, p.name AS providerName, pf.name AS profession, w.name AS workState FROM refurbishment AS r INNER JOIN provider AS p ON r.provider=p.cif INNER JOIN profession AS pf ON pf.id=p.profession INNER JOIN workState AS w ON r.workState=w.id WHERE community=?";
    let sql = "SELECT r.id, r.description, p.cif AS provider, p.name AS providerName, pf.name AS profession, w.name AS workState, d.id AS idBudget, b.numBudget, d.filename AS budget, i.id AS idInvoice, i.numInvoice, dc.filename AS invoice ";
    sql += "FROM refurbishment AS r INNER JOIN provider AS p ON r.provider=p.cif INNER JOIN profession AS pf ON pf.id=p.profession INNER JOIN workstate AS w ON r.workState=w.id left JOIN budget AS b ON b.refurbishment=r.id left JOIN document as d ON b.id=d.id left JOIN invoice as i ON i.refurbishment=r.id left JOIN document as dc ON i.id=dc.id WHERE r.community=? GROUP BY r.id";

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
//  GET a refurbishment by a given string
// ================================================
app.get('/:cif/:string', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        community: req.params.cif,
        string: req.params.string
    };
    let sql = "SELECT r.id, r.description, r.provider, r.community FROM refurbishment AS r INNER JOIN workstate AS w ON w.id=r.workState WHERE r.description LIKE ? AND r.community=?";
    await db.query(sql, ['%' + data.string + '%', data.community], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar en la base de dades',
                errors: err
            });
        }
        res.status(200).send({ results: results });
    });
});

// ==================================
// Add a refurbishment
// ==================================
app.post('/:cif', authentication.IsLoggedIn, async(req, res) => {

    // data of the refurbishment
    let data = {
        description: req.body.description,
        provider: req.body.provider,
        community: req.params.cif,
        workState: req.body.workState
    };

    // querys to database

    let sql = "INSERT INTO refurbishment SET ?";

    await db.query(sql, data, (err) => {

        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut afegir la reforma',
            });
        }

        res.status(200).send({
            message: 'La reforma ha quedat registrada'

        });

    });

});


// ====================================================================
// Update a refurbishment from a community
// ====================================================================

app.put('/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.body.description,
        req.body.provider,
        req.body.workState,
        req.params.id
    ];

    let sql = "UPDATE refurbishment SET description=?, provider=?, workState=? WHERE id=?";

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
// Remove a refurbishment from a community
// ====================================================================

app.delete('/:cif/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.params.id,
        req.params.cif
    ];

    let sql = "DELETE FROM refurbishment WHERE id=? AND community=?";

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