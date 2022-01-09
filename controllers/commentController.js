require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// get all comments
module.exports.commentsHandler = async (req, res) => {
    try {
        const comment = await prisma.comment.findMany()
          res.json(comment)
    } catch (error) {
        console.log(error)
    }
  };

// get a comment
module.exports.commentHandler = async (req, res) => {
    // getting comment by the postId -> post it is associated/related to
    try {
        const postId = req.params.postId;
      const comment = await prisma.comment.findMany({ 
        where: { 
        postId: Number(postId)
      },
      include: {
        author: {
            select: {
                username: true
            },
        }},
      });
      res.json(comment);
      } catch (error) {
        console.log(error)
      }
  };

    // create comment
  module.exports.createCommentHandler = async (req, res) => {
    try {
        const { content, postId } = req.body
        const authorId = req.user.id
        const comment = await prisma.comment.create({
          data: {
            content,
            username: req.user.username,
            post: { connect: { id: Number(postId) } },
            author: { connect: { id: Number(authorId)} },
        }
      })
        res.json(comment)
    } catch (error) {
        console.log(error)
    }
  };

    // delete comment
   module.exports.deleteCommentHandler = async (req, res) => {
    try {
        const commentId = req.params.commentId;
      await prisma.comment.delete({ 
        where: { 
        id: Number(commentId)
      }
      });
      res.json("delete successful");
      } catch (error) {
        console.log(error)
      }
  };