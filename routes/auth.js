const express = require('express')
const router = express.Router()
const { validator } = require('../middleware/validator')
require('dotenv').config()
const {
    signupHandler,
    loginHandler,
    currentUserHandler,
    userInfoHandler
} = require('../controllers/authController')
const { validateToken } = require('../middleware/authenticate')

// routes

// signup
router.post('/signup', validator, signupHandler)
// login
router.post('/login', loginHandler)
// me -> current user
router.get('/me', validateToken, currentUserHandler )
// user info -> current user info
router.get('/user/:id', userInfoHandler )

  

module.exports = router