const db = require('../config/database');

// ==================================================
// Insert the data of the user and the community
// ==================================================

const insertDataUser = (req, res) => {
    const today = new Date();
    const month = today.getMonth() + 1;
    let dataUser = {
        user: req.userData.id,
        community: req.body.cif,
        registerDate: today.getFullYear() + '-' + month + '-' + today.getDate(),
        floor: req.body.floor,
        door: req.body.door,
        side: req.body.side,
        name: req.body.name,
        belongsTo: req.body.belongsTo
    };
    console.log(dataUser);
    let sql = "INSERT INTO joincommunity SET ?";

    db.query(sql, dataUser, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'Les teves dades no són correctes'
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
    insertDataUser
}