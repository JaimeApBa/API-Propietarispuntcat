var express = require('express');
const db = require('../config/database');
const insertDataUser = require('./insertDataUser');
const insertRole = require('./insertRole');
var authentication = require('../middlewares/authentication');
var app = express();


// ==================================
// GET the community searched
// ==================================
app.get('/:address', authentication.IsLoggedIn, (req, res) => {

    let data = {
        address: req.params.address,
        id: req.userData.id
    };
    let sql = "SELECT * FROM community AS c INNER JOIN joincommunity AS j ON j.community=c.cif WHERE c.address LIKE ? AND j.user <> ?";
    db.query(sql, ['%' + data.address + '%', data.id], (err, results) => {
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
app.post('/', authentication.IsLoggedIn, (req, res) => {
    const today = new Date();
    let month = today.getMonth() + 1;
    // data of the community
    let data = {
        cif: req.body.cif,
        address: req.body.address,
        postalCode: req.body.postalCode,
        city: req.body.city,
        country: req.body.country,
        registerDate: today.getFullYear() + '-' + month + '-' + today.getDate(),
        latitude: req.body.latitude,
        longitude: req.body.longitude
    };
    // querys to database

    let sql = "INSERT INTO community SET ?";

    db.query(sql, data, (err) => {

        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut crear la comunitat',
            });
        } else {
            try {
                // insert role of the user
                req.body.role = 1;
                insertRole.insertRole(req);
                // insert the data of the user and the community
                req.body.belongsTo = 'yes';
                insertDataUser.insertDataUser(req);

            } catch (error) {
                console.log(error);
            }

            res.status(200).send({
                message: 'La comunitat ha quedat registrada'

            });
        }
    });

});

// ==================================
// Update Community
// ==================================
app.put('/:id', (req, res) => {
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
    db.query(sql, data, (err, results) => {
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