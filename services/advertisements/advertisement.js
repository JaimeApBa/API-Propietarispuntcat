var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ================================================
//  GET a list of the advertisements in a community
// ================================================
app.get('/:cif', authentication.IsLoggedIn, async(req, res) => {
    let data = [req.params.cif];

    let sql = "SELECT a.id, a.name, a.description, a.date, a.community, a.statement, concat(u.name,' ',u.fullname) AS user, j.floor, j.door, j.side FROM advertisement AS a INNER JOIN user AS u ON u.id=a.user INNER JOIN joincommunity AS j ON j.user=a.user AND a.community=j.community AND j.belongsTo='accepted' WHERE a.community=?";


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
//  GET a advertisement by a string
// ================================================
app.get('/:cif/:string', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        community: req.params.cif,
        string: req.params.string
    };
    let sql = "SELECT a.id, a.name, a.description, a.date, a.community, a.statement, concat(u.name,' ',u.fullname) AS user, j.floor, j.door, j.side FROM advertisement AS a INNER JOIN user AS u ON u.id=a.user INNER JOIN joincommunity AS j ON j.user=a.user AND a.community=j.community AND j.belongsTo='accepted' WHERE a.description LIKE ? AND a.community=?";
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

// ================================================
//  POST an advertisement in a community
// ================================================
app.post('/', authentication.IsLoggedIn, async(req, res) => {
    let data = {
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        user: req.body.user,
        community: req.body.community,
        statement: req.body.statement
    };

    let sql = "INSERT INTO advertisement SET ?";

    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al connectar amb la base de dades',
                errors: err
            });
        }
        res.status(200).send({
            message: 'Les teves dades s\'han guardat correctament',
        });
    });
});

// ====================================================================
// Update an advertisement from a community
// ====================================================================

app.put('/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.body.name,
        req.body.description,
        req.body.date,
        req.params.id
    ];

    let sql = "UPDATE advertisement SET name=?, description=?, date=? WHERE id=?";

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
// Remove an advertisement from a community
// ====================================================================

app.delete('/:cif/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.params.id,
        req.params.cif
    ];
    console.log(data);
    let sql = "DELETE FROM advertisement WHERE id=? AND community=?";

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