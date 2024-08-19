import PropTypes from 'prop-types'

const LoginNotification = (errorMessage) => {
  if (errorMessage === '') {
    return null
  }

  return (
    <div className="login_notification">
      {errorMessage}
    </div>
  )
}

LoginNotification.propTypes = {
  errorMessage: PropTypes.string.isRequired
}

export default LoginNotification