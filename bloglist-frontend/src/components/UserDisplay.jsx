import PropTypes from 'prop-types'

const UserDisplay = ({ username, handleLogout }) => {
  return (
    <div>
      {username} logged in
      <span>&nbsp;</span>
      <button
        type="submit"
        onClick={handleLogout}>logout</button>
    </div>
  )
}

UserDisplay.propTypes = {
  username: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired
}

export default UserDisplay