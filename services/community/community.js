var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();


// ==================================
// GET the community searched
// ==================================
app.get('/:address', authentication.IsLoggedIn, async(req, res) => {

    let data = {
        address: req.params.address,
        id: req.userData.id
    };
    let sql = "SELECT * FROM community AS c INNER JOIN hasrole AS h ON h.community=c.cif WHERE c.address LIKE ? AND h.user <> ? GROUP BY c.cif";
    await db.query(sql, ['%' + data.address + '%', data.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'La comunitat no existeix',
                errors: err
            });
        }
        res.status(200).send({ response: results });
    });
});

// ==================================
// Add a community
// ==================================
app.post('/:id', authentication.IsLoggedIn, async(req, res) => {
    const today = new Date();
    let month = today.getMonth() + 1;
    // data of the community
    let data = [
        req.body.cif,
        req.body.address,
        req.body.postalCode,
        req.body.city,
        req.body.country,
        today.getFullYear() + '-' + month + '-' + today.getDate(),
        req.body.latitude,
        req.body.longitude,
        req.params.id,
        req.body.name,
        req.body.floor,
        req.body.door,
        req.body.side,
        'accepted',
        5,
        1
    ];


    // querys to database

    let sql = "CALL createCommunity(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    await db.query(sql, data, (err) => {

        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut crear la comunitat',
            });
        }

        res.status(200).send({
            message: 'La comunitat ha quedat registrada'

        });

    });

});

// ==================================
// Update Community
// ==================================
app.put('/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [
        req.body.cif,
        req.body.name,
        req.body.address,
        req.body.postalCode,
        req.body.city,
        req.body.country,
        req.body.registerDate,
        req.body.latitude,
        req.body.longitude,
        req.params.id
    ];
    let sql = "UPDATE community SET cif= ?, name= ?, address= ?, postalCode= ?, city= ?, country= ?, registerDate= ?, latitude= ?, longitude= ? WHERE cif= ?";
    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut actualitzar la comunitat',
                errors: err
            });
        }
        res.status(200).send({ response: results });
    });
});



module.exports = app;