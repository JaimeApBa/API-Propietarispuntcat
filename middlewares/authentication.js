var jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

// ====================================================
// Get new token
// ====================================================

const generateToken = (payload) => {
    // create a token. Expires in 4hours (14400)
    try {
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 14400 });
    } catch (err) {
        return err;
    }

};

// ====================================================
// Verify token
// ====================================================

const IsLoggedIn = (req, res, next) => {

    var token = req.header('authorization');

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userData = decoded;

    } catch (err) {
        return res.status(401).send({
            message: 'La teva sessió no és vàlida'
        });
    }

    next();
};



// ====================================================
// Check if user is admin
// ====================================================

const isAdmin = (req, res, next) => {
    getRole(req).then((response) => {
        if (response === 'Administrador') {
            next();
            return;
        } else {
            res.status(401).send({
                message: 'No tens permís d\'accés'
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: 'No s\'ha pogut executar la operació'
        });
    });

};

// ====================================================
// Get Role
// ====================================================

const getRole = (req, res, next) => {

    return new Promise(
        (resolve, reject) => {
            let data = [req.userData.Id];

            let sql = "SELECT role.name FROM hasrole JOIN role ON hasrole.Role=role.Id WHERE hasrole.user=?";
            db.query(sql, data, (err, results) => {
                if (err) {
                    return reject('No s\'ha pogut executar la operació');
                }
                resolve(results[0].name);
            });
        }
    );



};
/*
// ====================================================
// Verificar ADMIN o Usuario
// ====================================================

exports.verificaROLE_OR_USUARIO = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: { message: 'No tienes privilegios para realziar esos cambios' }
        });


    }
}*/

module.exports = {
    generateToken,
    IsLoggedIn,
    isAdmin
}