/* eslint-disable indent */
import LoginNotification from './LoginNotification'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, password, setUsername, setPassword, errorMessage }) => {
  const pageLogin = async(event) => {
    event.preventDefault()
    await handleLogin({
      username: username,
      password: password
    })
  }

  return (
    <div>
      <h2>log in to application</h2>
      {LoginNotification(errorMessage)}
      <form onSubmit={pageLogin}>
        <div>
          username
            <span>&nbsp;</span>
            <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          password
          <span>&nbsp;</span>
            <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type="submit">login</button>
        <p></p>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm