import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ user, blog, handleLike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'flex-wrap'
  }

  const [btnName, setBtnName] = useState('view')

  const toggleName = () => {
    btnName === 'view' ? setBtnName('hide') : setBtnName('view')
  }

  const likeBlog = async(event) => {
    event.preventDefault()

    await handleLike({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user,
      id: blog.id
    })
  }

  const deleteBlog = async(event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await handleDelete({
        title: blog.title,
        author: blog.author,
        id: blog.id
      })
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button onClick={toggleName}>{btnName}</button>
      {btnName === 'hide' && <div className='blogDetail'>
        {blog.url}
        <br/>

        <div className='blog_likes'>
          likes {blog.likes}&nbsp;
          <button onClick={likeBlog}>like</button>
        </div>

        <div className='blog_adder'>
          {blog.user.name}
        </div>

        {blog.user.name === user.name &&
          <button onClick={deleteBlog}>remove</button>
        }
      </div>}
    </div>
  )
}

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Blog