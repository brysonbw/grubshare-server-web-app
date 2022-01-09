const express = require('express')
const router = express.Router()
require('dotenv').config()
const {
    commentsHandler,
    commentHandler,
    createCommentHandler,
    deleteCommentHandler
} = require('../controllers/commentController')
const { validateToken } = require('../middleware/authenticate')

// routes

// all comments
router.get('/all', commentsHandler)
// a comment -> by postId
router.get('/:postId', commentHandler)
// create comment
router.post('/create', validateToken, createCommentHandler )
// delete comment
router.delete('/:commentId', deleteCommentHandler )

  

module.exports = router