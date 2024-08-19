/* eslint-disable indent */
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

// eslint-disable-next-line no-undef
beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
}, 50000)


/* eslint-disable no-undef */
describe('return blogs', () => {
  test('blogs are returned as json', async() => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)
  
  test('all blogs are returned', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  
  test('a specific blog is within the returned blogs', async() => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
  
    expect(titles).toContain(
      '2017 Barkley Marathons Training'
    )
  })
})

describe('check the unique identifier', () => {
  test('a blog post has a unique identifier property', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
  
    const resultBlogId = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
    
    // Passed on first try baby.
    expect(resultBlogId).toBeDefined()
  })
})

// 4.23 is here.
describe('add blogs with different info', () => {
  beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('barkley15', 10)
    const user = new User({ 
      username: 'randomforestrunner',
      passwordHash 
    })

    await user.save()
  }, 50000)

  test('a valid blog can be added', async() => {
    // Login as the user in beforeEach.
    const loginUser = {
      username: 'randomforestrunner',
      password: 'barkley15'
    }

    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Post a new blog as this user. But we need the user's id first.
    const addedUser = await User.findOne({ 
      username: 'randomforestrunner'
    })

    const userForToken = { username: 'randomforestrunner', id: addedUser._id }
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    })

    const newBlog = {
      url: 'https://randomforestrunner.com/2022/07/2022-hardrock/',
      title: '2022 Hardrock - Party at the Burrows Aid Station',
      author: 'John Kelly',
      likes: 0,
      userId: addedUser._id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    // Check that the total number of blogs has increased by one.
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
  
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      '2022 Hardrock - Party at the Burrows Aid Station'
    )
  })

  // Let's work on 4.11
  test('default value of the likes property', async() => {
    const loginUser = {
      username: 'randomforestrunner',
      password: 'barkley15'
    }

    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Post a new blog as this user. But we need the user's id first.
    const addedUser = await User.findOne({ 
      username: 'randomforestrunner'
    })

    const userForToken = { username: 'randomforestrunner', id: addedUser._id }
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    })

    const newBlog = {
      url: 'https://randomforestrunner.com/2021/09/2021-tor-des-geants/',
      title: '2021 Tor Des Geants - Pizza, Gelato, and Rhabdo',
      author: 'John Kelly',
      userId: addedUser._id
    }

    // Verify that a new blog has been added.
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Now, the problem is to extract the blog you have just put into, then 
    // check if the likes property has been default to 0.
    const blogsAtStart = await helper.blogsInDb()
    const blogtoCheck = blogsAtStart[helper.initialBlogs.length]

    // Extract the newest added blog, which is the blog in this test.
    const resultBlog = await api
      .get(`/api/blogs/${blogtoCheck.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Make sure the blog is added.
    expect(JSON.stringify(resultBlog._body)).toEqual(JSON.stringify({
      url: 'https://randomforestrunner.com/2021/09/2021-tor-des-geants/',
      title: '2021 Tor Des Geants - Pizza, Gelato, and Rhabdo',
      author: 'John Kelly',
      user: addedUser._id,
      likes: 0,
      id: blogtoCheck.id
    }))
  })

  // One step at the time. 4.12 here we go.
  test('blog without title is not added', async() => {
    const loginUser = {
      username: 'randomforestrunner',
      password: 'barkley15'
    }

    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Post a new blog as this user. But we need the user's id first.
    const addedUser = await User.findOne({ 
      username: 'randomforestrunner'
    })

    const userForToken = { username: 'randomforestrunner', id: addedUser._id }
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    })

    const newBlog = {
      url: 'https://example.com/',
      author: 'Me',
      likes: 0,
      userId: addedUser._id
    }

    // Verify that a new blog did not get added.
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without url is not added', async() => {
    const loginUser = {
      username: 'randomforestrunner',
      password: 'barkley15'
    }

    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Post a new blog as this user. But we need the user's id first.
    const addedUser = await User.findOne({ 
      username: 'randomforestrunner'
    })

    const userForToken = { username: 'randomforestrunner', id: addedUser._id }
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    })

    const newBlog = {
      title: 'Test missing url',
      author: 'Me',
      likes: 0,
      userId: addedUser._id
    }

    // Verify that a new blog did not get added.
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
    
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  // Probably the hardest part here. Let's try it with the real blog first.
  test('blog without token is not added', async() => {
    const loginUser = {
      username: 'randomforestrunner',
      password: 'barkley15'
    }

    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Post a new blog as this user. But we need the user's id first.
    const addedUser = await User.findOne({ 
      username: 'randomforestrunner'
    })

    const token = 'insertrandomstring'

    const newBlog = {
      url: 'https://randomforestrunner.com/2021/09/2021-tor-des-geants/',
      title: '2021 Tor Des Geants - Pizza, Gelato, and Rhabdo',
      author: 'John Kelly',
      userId: addedUser._id
    }

    // Verify that a new blog has been added.
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(401)

    // Make sure no unauthorized blog is added.
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

// 4.13 seems easier than 4.14. Maybe I will leave 4.14 for tomorrow.
describe('delete a blog', () => {
  test('delete succeeds with status code 204 if id is valid', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('update a blog', () => {
  beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('barkley15', 10)
    const user = new User({ 
      username: 'randomforestrunner',
      passwordHash 
    })

    await user.save()
  }, 50000)

  test('update succeeds with status code 200 if id is valid', async() => {
    // Make a new user.
    const newUser = {
      username: 'countryhighpoints',
      name: 'Eric Gilbertson',
      password: 'mitalumni'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Login as this new user.
    const loginUser = {
      username: 'countryhighpoints',
      password: 'mitalumni'
    }

    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Post a new blog as this user. But we need the user's id first.
    const addedUser = await User.findOne({ 
      username: 'countryhighpoints'
    })

    const userForToken = { username: 'countryhighpoints', id: addedUser._id }
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    })

    const newBlog = {
      url: 'https://www.countryhighpoints.com/broad-peak/',
      title: 'Broad Peak',
      author: 'Eric Gilbertson',
      likes: 0,
      userId: addedUser._id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const addedBlog = await Blog.findOne({ 
      title: 'Broad Peak'
    })

    const idToUpdate = addedBlog._id

    // Update the added blog using the added blog's id.
    const updateBlog = {
      url: 'https://www.countryhighpoints.com/k2/',
      title: 'K2',
      author: 'Eric Gilbertson',
      likes: 0,
      userId: addedUser._id
    }

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    // Extract the updated blog, which is the blog in this test.
    const resultBlog = await api
      .get(`/api/blogs/${idToUpdate}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Make sure the blog is updated.
    expect(JSON.stringify(resultBlog._body)).toEqual(JSON.stringify({
      url: 'https://www.countryhighpoints.com/k2/',
      title: 'K2',
      author: 'Eric Gilbertson',
      user: addedUser._id,
      likes: 0,
      id: addedBlog._id
    }))
  }, 50000)
})

describe('when there is initially one user in db', () => {
  beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('barkley', 10)
    const user = new User({ 
      username: 'root',
      passwordHash 
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'randomforestrunner',
      name: 'John Wade Kelly',
      password: 'barkley15'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username is already taken', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

describe('constraints of creating a new user', () => {
  test('creation fails if username is not given', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superuser2',
      password: 'salainen2'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    //console.log('result.body.error:', result.body.error)
    expect(result.body.error).toContain('Path `username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password is not given', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root2',
      name: 'Superuser2',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if username is not of length 3 or more', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser2',
      password: 'salainen2'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      //.expect(400)
      .expect('Content-Type', /application\/json/)

    //console.log('result.body.error:', result.body.error)
    expect(result.body.error).toContain(
      // Maybe not a good idea to use username like this, but this works for now.
      'Path `username` (`ro`) is shorter than the minimum allowed length (3).'
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password is not of length 3 or more', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root2',
      name: 'Superuser2',
      password: 'sa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    //console.log('result.body.error:', result.body.error)
    expect(result.body.error).toContain('expect `password` of length 3 or more.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async() => {
  await mongoose.connection.close()
}, 50000)