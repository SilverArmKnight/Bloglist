require('dotenv').config()

const PORT = process.env.PORT

// Due to the way this is written, you need e2e_test instead of just test in 
// package.json so that the backend is connected to the correct port, which is 3001.
const MONGODB_URI = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'e2e_test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}