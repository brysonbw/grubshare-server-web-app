const { check } = require('express-validator')

const validator = [
// check user email
    check('email', 'Please enter a valid email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .toLowerCase(),
    // check user password
    check('password')
    .trim()
    .isLength({
        min: 10,
        max: 128
    })
    .withMessage("Password must be minimum ten characters and maximum 128 characters.")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/)
    .withMessage('Password must have 1 uppercase, 1 lowercase letter and 1 number'),
    // check user username ->  min: 3, max: 20
    check('username', 'Please enter a username that has a min: of 3 characters & max: 20 characters')
    .trim()
    .isLength({
        min: 3,
        max: 20
    }),
]

module.exports = { validator }