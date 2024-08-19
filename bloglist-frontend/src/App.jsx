/* eslint-disable indent */
import { useState, useEffect, useRef } from 'react'
import '../index.css'

import loginForm from './components/LoginForm'
import blogForm from './components/BlogForm'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [blogMessage, setBlogMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  function compareLikes(firstBlog, secondBlog) {
    return secondBlog.likes - firstBlog.likes
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(compareLikes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setUsername(user.name)
      blogService.setToken(user.token)
    }
  }, [])

  // In case this is not best practice, you can put handleLogin and handleLogout here.
  // Check older version on github in case you get lost.
  const handleLogin = async(event) => {
    try {
      const user = await loginService.login({
        username: event.username,
        password: event.password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername(user.name)
      setPassword('')

    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      console.log('Error message:', exception.response.data.error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleLogout = async(event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)     // Not sure what to do about the token.
      setUsername('')
      setErrorMessage('')
    } catch (exception) {
      setErrorMessage('Log out fails due to unknown error.')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleCreate = async(blogObject) => {
    try {
      const newBlog = await blogService.create({
        title: blogObject.title,
        author: blogObject.author,
        url: blogObject.url
      })

      // We add user to new blog before displaying it.
      newBlog.user = user
      setBlogs(blogs.concat(newBlog))

      // Set notification message.
      setBlogMessage(`A new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setBlogMessage('')
      }, 5000)

    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }

    blogFormRef.current.toggleVisibility()
  }

  // If you bring handleLike here, make sure the blogs are sorted after each like.
  const handleLike = async(blogObject) => {
    try {
      await blogService.update(blogObject.id, {
        title: blogObject.title,
        author: blogObject.author,
        url: blogObject.url,
        likes: blogObject.likes
      })

      sortBlogs({
        title: blogObject.title,
        author: blogObject.author,
        action: 'liked'
      })

    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleDelete = async(blogObject) => {
    try {
      // Delete the blog and sort the remaining ones.
      await blogService.remove(blogObject.id)
      sortBlogs({
        title: blogObject.title,
        author: blogObject.author,
        action: 'deleted'
      })

    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  // Pass this thing to Blog for 5.10
  const sortBlogs = async(event) => {
    try {
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort(compareLikes))

      // Add message later.
      setBlogMessage(`The blog ${event.title} by ${event.author} ${event.action}`)
      setTimeout(() => {
        setBlogMessage('')
      }, 5000)

    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <div>
      {!user && loginForm({ handleLogin,
                            username,
                            setUsername,
                            password,
                            setPassword,
                            errorMessage })}

      {user && blogForm({ user,
                        handleCreate,
                        blogMessage,
                        username,
                        handleLogout,
                        blogFormRef,
                        blogs,
                        handleLike,
                        handleDelete })}
    </div>
  )
}

export default App