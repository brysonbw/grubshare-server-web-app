const express = require('express')
const router = express.Router()

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { validate } = require('../middleware/authenticate')
const prisma = new PrismaClient()

// get all posts
router.get('/feed', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
           orderBy: { createdAt:'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    },
                },
                comments: true
            },
          })
          res.json(posts)
    } catch (error) {
        console.log(error)
    }
  })


// create post
router.post('/create', validate, async (req, res) => {
    try {
        const { title, description, ingredients, meal, image } = req.body
        // decoding image base64 string (from client) -> converting and storing in database as binary object
        let imageByte = Buffer.from(image.replace("data:", "").replace(/^.+,/, ""), 'base64')
        const result = await prisma.post.create({
          data: {
            title,
            description,
            ingredients,
            meal,
            image: imageByte,
            author: { connect: { email: req.user.email} },
          },
        })
        res.json(result)
    } catch (error) {
        console.log(error)
    }
  })


// get post by ID
  router.get('/:id', async (req, res) => {
      try {
        const { id } = req.params
        const post = await prisma.post.findUnique({
          where: { id: Number(id) },

          include: {
              author: {
                  select: {
                      username: true
                  }
              },
              comments: true
          }
        })
        res.json(post) 
      } catch (error) {
          console.log(error)
      }
  })


// get users post by authorId
  router.get('/user/:id',  async (req, res) => {
  try {
    const id  = req.params.id
    const userPost = await prisma.post.findMany({
      where: { 
        authorId: Number(id)
      }
  });
    res.json(userPost)
  } catch (error) {
    console.log(error)
  }
  })

  // delete a post by ID
  router.delete('/:id', async (req, res) => {
    try {
      const id  = req.params.id
        await prisma.post.delete({
  where: {
    id: Number(id),
  },
})
      res.json(`successfully deleted!`)
    } catch (error) {
      console.log(error)
    }
  })
  

module.exports = router