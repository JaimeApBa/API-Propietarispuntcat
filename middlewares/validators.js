const { response } = require('express');
const { check, validationResult } = require('express-validator');


const validateUser = [
    check('name', 'El nom és obligatori').not().isEmpty().trim().escape(),
    check('fullname', 'Els cognoms són obligatoris').not().isEmpty().trim().escape(),
    check('phone').optional(),
    check('email', 'El correu electrònic és obligatori').not().isEmpty(),
    check('email', 'El correu electrònic no és correcte').isEmail().normalizeEmail(),
    check('password', 'la contrasenya és obligatoria').not().isEmpty()
];

const validateLogin = [
    check('email', 'El correu electrònic és obligatori').not().isEmpty(),
    check('email', 'El correu electrònic no és correcte').isEmail().normalizeEmail(),
    check('password', 'La contrasenya és obligatoria').not().isEmpty()
];


const validateFields = (req, res = response, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: errors.mapped()
        });
    }
    next();
}

module.exports = {
    validateUser,
    validateLogin,
    validateFields
}