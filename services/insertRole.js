const db = require('../config/database');


// ==================================
// Insert the role of the user
// ==================================

const insertRole = (req, res) => {
    // if user create a community, this user is the admin
    let dataRole = {
        user: req.userData.id,
        community: req.body.cif,
        role: req.body.role
    };
    let sql = "INSERT INTO hasRole SET ?";

    db.query(sql, dataRole, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'No s\'ha pogut crear la comunitat'
            });
        } else {
            if (results.length > 0) {
                return res.status(200).send({
                    message: 'Les teves dades són correctes',
                    response: results
                });

            }

        }
    });
};

module.exports = {
    insertRole
}