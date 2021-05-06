var express = require('express');
const db = require('../../config/database');

var authentication = require('../../middlewares/authentication');
var app = express();



// ==================================
// Update Role User in the Community
// ==================================
app.put('/:id/:cif', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.body.role,
        req.params.id,
        req.params.cif
    ];

    // Set the role of Propietari or Secretari
    let sql = "CALL updateRoleUser(?,?,?);";
    await db.query(sql, data, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: 'No s\'ha pogut actualitzar el rol',
                errors: err
            });
        }

        res.status(200).send({
            message: 'S\'ha actualitzat el rol d\'aquest usuari'
        });
    });
});



module.exports = app;