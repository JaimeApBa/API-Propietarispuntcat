var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var app = express();

// ============================================
// Get the role of the user in the community
// ============================================

app.get('/:id', authentication.IsLoggedIn, async(req, res) => {

    let data = [req.params.id];

    let sql = "SELECT h.user, h.role,h.community, c.address, j.belongsTo,u.id, u.name, u.fullname, u.email, j.floor, j.door, j.side, j.estateAdministrator FROM hasrole As h INNER JOIN joincommunity AS j ON j.community=h.community INNER JOIN user As u ON j.user=u.id INNER JOIN community AS c ON c.cif=j.community WHERE j.belongsTo='pending' && h.user=? && (h.role BETWEEN 1 AND 3 || h.isAdmin=1)";
    await db.query(sql, data, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error en la busqueda de dades',
                errors: err
            });
        }
        res.status(200).send({ response: results });
    });
});


module.exports = app;