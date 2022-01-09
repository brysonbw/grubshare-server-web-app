const express = require('express')
const router = express.Router()
require('dotenv').config()
const {
    postsHandler,
    createPostHandler,
    postHandler,
    userPostHandler,
    deletePostHandler
} = require('../controllers/postController')
const { validateToken } = require('../middleware/authenticate')

// routes

// all posts
router.get('/feed', postsHandler)
// a comment
router.post('/create', validateToken, createPostHandler)
// a post
router.get('/:id', postHandler )
// a user post
router.get('/user/:id', userPostHandler )
// delete post
router.delete('/:id', deletePostHandler )

  

module.exports = router