import PropTypes from 'prop-types'

const BlogNotification = (blogMessage) => {
  if (blogMessage === '') {
    return null
  }

  return (
    <div className="blog_notification">
      {blogMessage}
    </div>
  )
}

BlogNotification.propTypes = {
  blogMessage: PropTypes.string.isRequired,
}

export default BlogNotification