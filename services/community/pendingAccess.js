var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ====================================================================
//  GET a list of the pending requests access to the community
// ====================================================================
app.get('/:id', authentication.IsLoggedIn, async(req, res) => {
    let data = [req.params.id];
    let sql = "SELECT * FROM community AS c INNER JOIN joincommunity AS j ON c.cif=j.community WHERE j.belongsTo='pending' AND j.user=?";
    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar les teves comunitats',
                errors: err
            });
        }
        res.status(200).send({ results: results });
    });
});

module.exports = app;