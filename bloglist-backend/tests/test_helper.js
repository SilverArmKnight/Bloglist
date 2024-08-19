const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    url: 'https://randomforestrunner.com/2017/03/2017-barkley-marathons-training/',
    title: '2017 Barkley Marathons Training',
    author: 'John Kelly',
    likes: 0
  }, 
  {
    url: 'https://randomforestrunner.com/home/about-me/',
    title: 'About Me',
    author: 'John Kelly',
    likes: 0
  }
]

const nonExistingId = async() => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()
  
  return blog._id.toString()
}
  
const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

// Can't tell you why I wrote this stuff here yet I did not know why it exists.
// Until 4.23 I guess.
const usersInDb = async() => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
  
module.exports = {
  initialBlogs,
  nonExistingId, 
  blogsInDb,
  usersInDb
}