const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

// signup
module.exports.signupHandler = async (req, res) => {
    const { email, username, password } = req.body
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
                password: hashPassword,
            }
        })

        return res.json(`${user.username} is signed up!`)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // send error -> if email already exist
            if (error.code === 'P2002') {
              return res.status(400).send(
                'Sorry, an error occurred - This email is already associated with an account.'
              )
            }
          } else {
              console.log(error)
          }
    }
  };

  
  // login
  module.exports.loginHandler = async (req, res) => {
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
  };


  // check auth -> get current user
  module.exports.currentUserHandler = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log(error)
    }
  };


// get user info -> info for user profile
  module.exports.userInfoHandler = async (req, res) => {
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
  };