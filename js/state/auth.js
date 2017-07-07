import { EMAIL_CHANGE_SUCCEEDED } from './accountEmailChangeConfirm'
const AUTHENTICATE = 'AUTHENTICATE'
const TOKEN = 'TOKEN'
const USER = 'USER'
export const LOGIN = 'LOGIN'
const LOGIN_FAILED = 'LOGIN_FAILED'
const LOGOUT = 'LOGOUT'
const AUTOLOGIN_COMPLETE = 'AUTOLOGIN_COMPLETE'
const USER_UPDATED = 'USER_UPDATED'

export const authenticate = (token, user) => ({
  type: AUTHENTICATE,
  token,
  user
})

export const logout = () => ({
  type: LOGOUT
})

export const token = token => ({
  type: TOKEN,
  token
})

export const user = user => ({
  type: USER,
  user
})

export const autologinComplete = (success, error) => ({
  type: AUTOLOGIN_COMPLETE,
  error
})

export const userUpdated = (property, value) => ({
  type: USER_UPDATED,
  property,
  value
})

export const login = (email, password) => ({
  type: LOGIN,
  email,
  password
})

export const loginFailed = error => ({
  type: LOGIN_FAILED,
  error
})

const auth = (state = {token: false, user: false, autologinComplete: false, autologinError: false, error: false}, action) => {
  switch (action.type) {
    case LOGIN:
      return {...state, error: false}
    case LOGIN_FAILED:
      return {...state, error: action.error}
    case AUTHENTICATE:
      return {...state, token: action.token, user: action.user}
    case LOGOUT:
      return {...state, token: false, user: false}
    case TOKEN:
      return {...state, token: action.token}
    case USER:
      return {...state, user: action.user}
    case AUTOLOGIN_COMPLETE:
      return {...state, autologinComplete: true, autologinError: state.error}
    case USER_UPDATED:
      return {...state, user: state.user.updated({[action.property]: action.value})}
    case EMAIL_CHANGE_SUCCEEDED:
      return {...state, user: state.user.updated({email: action.email})}
    default:
      return state
  }
}

export default auth
