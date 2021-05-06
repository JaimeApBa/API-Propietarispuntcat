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


module.exports = {
    generateToken,
    IsLoggedIn,

}