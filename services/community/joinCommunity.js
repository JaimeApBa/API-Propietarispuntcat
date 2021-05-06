var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();


// ==================================
// get the users in a community
// ==================================
app.get('/:cif', authentication.IsLoggedIn, async(req, res) => {

    let data = [req.params.cif];

    let sql = "SELECT u.id, u.name, u.fullname, u.phone, u.email, j.floor, j.door, j.side, j.estateAdministrator, r.name AS role, h.isAdmin AS admin  FROM hasrole As h INNER JOIN user AS u ON u.id=h.user INNER JOIN joincommunity AS j ON h.community=j.community AND j.user=h.user INNER JOIN role AS r ON r.id=h.role WHERE h.community=? GROUP BY u.email ORDER BY j.side,j.floor,j.door";

    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al connectar amb la base de dades'
            });
        } else {
            if (results.length > 0) {
                return res.status(200).send({
                    message: 'Les teves dades són correctes',
                    response: results
                });
            } else {
                return res.status(200).send({
                    message: 'No s\'ha trobat cap resultat',
                    response: results
                });
            }
        }
    });

});

// ==================================
// Request to join a community
// ==================================
app.post('/:id', authentication.IsLoggedIn, async(req, res) => {
    // since the user is not accepted in the community, belongsTo is pending by default
    const today = new Date();
    const month = today.getMonth() + 1;
    let data = {
        user: req.params.id,
        community: req.body.cif,
        registerDate: today.getFullYear() + '-' + month + '-' + today.getDate(),
        floor: req.body.floor,
        door: req.body.door,
        side: req.body.side,
        name: req.body.name,
        belongsTo: 'pending',
        estateAdministrator: req.body.estateAdministrator
    };

    let sql = "INSERT INTO joincommunity SET ?";


    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al connectar amb la base de dades'
            });
        } else {
            return res.status(200).send({
                message: 'Les teves dades són correctes',
                response: results
            });
        }
    });

});

// ====================================================================
// Update data when the user is accepted or refused in the community
// ====================================================================
app.put('/', authentication.IsLoggedIn, async(req, res) => {
    const role = (req.body.estateAdministrator ? 1 : 5);
    let data = [
        req.body.community,
        req.body.id,
        req.body.floor,
        req.body.door,
        req.body.side,
        req.body.belongsTo,
        role,
        0
    ];

    let sql = "CALL acceptRefuseUserCommunity(?,?,?,?,?,?,?,?)";

    await db.query(sql, data, (err) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al connectar amb la base de dades'
            });
        }

        res.status(200).send({ message: 'La teva petició s\'ha realitzat correctament' });
    });
});

// ====================================================================
// Remove a user from a community
// ====================================================================

app.delete('/:user/:cif', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.params.user,
        req.params.cif
    ]

    let sql = "DELETE hasrole, joincommunity FROM hasrole INNER JOIN joincommunity ON hasrole.user=joincommunity.user AND hasrole.community=joincommunity.community where hasrole.user=? AND hasrole.community=?";

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