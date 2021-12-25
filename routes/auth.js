const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { PrismaClient, Prisma } = require('@prisma/client')
const { validate } = require('../middleware/authenticate')
const prisma = new PrismaClient()

// signup user
router.post('/signup', [
    // check if email is valid
    check('email', 'Please enter a valid email')
    .isEmail(),
    // check password length -> min 7 char
    check('password', 'Please enter a password that is greater than 7 characters.')
    .isLength({
        min: 7
    }),
    // check username min: 3, max: 20
    check('username', 'Please enter a username that has a min: of 3 characters & max: 20 characters')
    .isLength({
        min: 3,
        max: 20
    }),
], async (req, res) => {
   const { email, username, password} = req.body
   const errors = validationResult(req)

   // validate input 
   if(!errors.isEmpty()) {
       return res.status(400).json({
           errors: errors.array()
       })
   }

    // hash password
    // save to database if valid
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hashPassword
            }
        })

        return res.json(`${user.username} is registered!`)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // send error -> if email already exist
            if (error.code === 'P2002') {
              return res.status(400).send(
                'Sorry, that user already exist - please enter a different email address.'
              )
            }
          }
    }
})


// login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        // error > if email does not match
        if (!user) {
            return res.status(400).json({error: 'User does not exist'})
        }
        // error -> if password does not match - hashPassword
        // compare hashPassword to user password
       const valid = await bcrypt.compare(password, user.password)
       if (!valid) {
        return res.status(400).json({error: 'Password does not match'})
       }
    
       // create access token
       const accessToken = jwt.sign(
        { username: user.username, id: user.id, email: user.email },
        `${process.env.ACCESS_SECRET}`, 
            { expiresIn: `${process.env.TOKEN_EXPIRE}` },
       )

       return res.json({ token: accessToken, username: user.username , id: user.id, email: user.email })
    } catch (error) {
        console.log(error)
    }
})


// check if user is auth
router.get("/me", validate, async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log(error)
    }
}); 

// get user info -> info for user profile
router.get('/user/:id', async (req, res) => {
    try {
    const id = req.params.id
    const user = await prisma.user.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            id: true,
            username: true,
        }
    })
    res.json(user) 
    } catch (error) {
        console.log(error)
    }

})
  

module.exports = router