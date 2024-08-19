import PropTypes from 'prop-types'
import Blog from './Blog'

const BlogDisplay = ({ user, blogs, handleLike, handleDelete }) => {
  return (
    <div>
      <p></p>
      {blogs.map(blog =>
        <Blog key={blog.id}
          user={user}
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      )}
    </div>
  )
}

BlogDisplay.propTypes = {
  user: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default BlogDisplay