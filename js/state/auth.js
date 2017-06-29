const AUTHENTICATE = 'AUTHENTICATE'
const LOGOUT = 'LOGOUT'

export const authenticate = (token, user) => ({
  type: AUTHENTICATE,
  token,
  user
})

export const logout = () => ({
  type: LOGOUT
})

const auth = (state = false, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        user: action.user
      }
    case LOGOUT:
      return false
    default:
      return state
  }
}

export default auth
