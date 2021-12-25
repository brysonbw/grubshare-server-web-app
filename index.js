const express = require('express')
const cors = require('cors')
require('dotenv').config()

// app
const app = express()


// middleware 
// set limit MB for (client) user image file data
app.use(express.json({limit: '30mb'}))
// cors config
app.use(cors())

// routers

// auth router
const authRouter = require('./routes/auth')
// post router
const postRouter = require('./routes/post')
// comment router
const commentRouter = require('./routes/comment')


// routes

// auth
app.use('/api/auth', authRouter)
// post
app.use('/api/post', postRouter)
// comment
app.use('/api/comment', commentRouter)


const PORT = process.env.PORT || 3007
app.listen(PORT, () => {
  console.log(`Server GOOD, running on port ${PORT}...`)
})