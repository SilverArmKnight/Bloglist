/* eslint-disable indent */
import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogCreate = ({ handleCreate }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const createBlog = async(event) => {
    event.preventDefault()
    await handleCreate({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={createBlog}>
        <h2>create new</h2>

        <div>
          title
          <span>&nbsp;</span>
          <input
            data-testid='title'
            type="text"
            value={title}
            name="Title"
            onChange={handleTitleChange}
            placeholder='write title'
          />
        </div>

        <div>
          author
          <span>&nbsp;</span>
          <input
            data-testid='author'
            type="text"
            value={author}
            name="Author"
            onChange={handleAuthorChange}
            placeholder='write author'
          />
        </div>

        <div>
          url
          <span>&nbsp;</span>
          <input
            data-testid='url'
            type="text"
            value={url}
            name="Url"
            onChange={handleUrlChange}
            placeholder='write url'
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

// Not sure what blogFormRef is supposed to be but okay.
BlogCreate.propTypes = {
  handleCreate: PropTypes.func.isRequired
}

export default BlogCreate