/* eslint-disable indent */
import PropTypes from 'prop-types'
import BlogNotification from './BlogNotification'
import BlogCreate from './BlogCreate'
import BlogDisplay from './BlogDisplay'
import UserDisplay from './UserDisplay'
import Togglable from './Togglable'

// I see that we are prop drilling now.
const BlogForm = ({ user,
                  handleCreate,
                  blogMessage,
                  username,
                  handleLogout,
                  blogFormRef,
                  blogs,
                  handleLike,
                  handleDelete }) => {

  // Okay, let's put handleLogout here.
  /**
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
    */

  return (
    <div>
      <h2>blogs</h2>
      {BlogNotification(blogMessage)}

      {UserDisplay({ username, handleLogout })}

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogCreate handleCreate={handleCreate}/>
      </Togglable>

      {BlogDisplay({ user, blogs, handleLike, handleDelete })}
    </div>
  )
}

BlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  handleCreate: PropTypes.func.isRequired,
  blogMessage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
  blogFormRef: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default BlogForm