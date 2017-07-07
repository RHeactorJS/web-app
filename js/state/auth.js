import { EMAIL_CHANGE_SUCCEEDED } from './accountEmailChangeConfirm'
export const AUTHENTICATE = 'AUTHENTICATE'
export const TOKEN = 'TOKEN'
export const USER = 'USER'
export const LOGIN = 'LOGIN'
const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGOUT = 'LOGOUT'
export const AUTOLOGIN = 'AUTOLOGIN'
const AUTOLOGIN_SUCCESS = 'AUTOLOGIN_SUCCESS'
const AUTOLOGIN_FAILED = 'AUTOLOGIN_FAILED'
export const USER_UPDATED = 'USER_UPDATED'

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

export const autologin = () => ({
  type: AUTOLOGIN
})

export const autologinSuccess = (token, user) => ({
  type: AUTOLOGIN_SUCCESS,
  token,
  user
})

export const autologinFailed = (error) => ({
  type: AUTOLOGIN_FAILED,
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
    case AUTOLOGIN_SUCCESS:
      return {...state, autologinComplete: true, token: action.token, user: action.user}
    case AUTOLOGIN_FAILED:
      return {...state, autologinComplete: true, autologinError: action.error}
    case USER_UPDATED:
      return {...state, user: state.user.updated({[action.property]: action.value})}
    case EMAIL_CHANGE_SUCCEEDED:
      return {...state, user: state.user.updated({email: action.email})}
    default:
      return state
  }
}

export default auth
