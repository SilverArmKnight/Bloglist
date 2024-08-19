
/* eslint-disable no-constant-condition */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/user')
//const jwt = require('jsonwebtoken')


// get id
blogsRouter.get('/:id', async(request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async(request, response) => {
  const user = request.user
  const body = request.body

  //console.log('user:', user)
  //console.log('body:', body)

  if (Object.is(user, null)) {
    response.status(401).json({ error: 'Unauthorized user cannot make a blog post.' })

  } else {
    // Conditional statement for likes.
    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      likes: typeof body.likes === 'undefined' ? 0 : body.likes,
      user: user.id
    })

    // Not too sure why we have this condition. Maybe in case of missing inputs?
    if (typeof blog.title === 'undefined' || typeof blog.url === 'undefined') {
      response.status(400).end()
    } else {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
    
      response.status(201).json(savedBlog)
    }
  }
})

// delete
blogsRouter.delete('/:id', async(request, response) => {
  // eslint-disable-next-line no-unused-vars
  const user = request.user

  //console.log('Do we reach the backend?')

  // Find the blog using the id stored in the HTTP Delete request.
  const blog = await Blog.findById(request.params.id)

  // Check if the stored blog has the same id as the HTTP Delete request blog.
  if (blog._id.toString() === request.params.id.toString()) {
    // eslint-disable-next-line no-unused-vars
    const removedBlog = await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
    
  } else {
    response.status(400).json({ error: 'input id does not match fetched id.' })
  }
})

// update.
blogsRouter.put('/:id', async(request, response) => {
  const body = request.body
  //const user = request.user

  //console.log('request:', request)
  //console.log('body:', body)
  
  // No new Blog because it will auto-assign an _id, meaning we cannot use findByIdAndUpdate.
  const blogToUpdate = {
    url: body.url,
    title: body.title,
    author: body.author,
    likes: typeof body.likes === 'undefined' ? 0 : body.likes,
    //user: body.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
  response.status(201).json(updatedBlog)
})

// These methods may need to be fixed in the future.
blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate(
    'user', { username: 1,  name: 1, id: 1 }
  )
  
  response.json(blogs)
})

module.exports = blogsRouter