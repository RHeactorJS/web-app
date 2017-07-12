import { ME_UPDATED } from '../profile/actions'
export const AUTHENTICATE = 'AUTHENTICATE'
export const TOKEN = 'TOKEN'
export const ME = 'ME'
export const LOGIN = 'LOGIN'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGOUT = 'LOGOUT'
export const AUTOLOGIN = 'AUTOLOGIN'
export const AUTOLOGIN_SUCCESS = 'AUTOLOGIN_SUCCESS'
export const AUTOLOGIN_FAILED = 'AUTOLOGIN_FAILED'
export const REFRESH_TOKEN = 'REFRESH_TOKEN'

export const authenticate = (token, me) => ({
  type: AUTHENTICATE,
  token,
  me
})

export const logout = () => ({
  type: LOGOUT
})

export const token = token => ({
  type: TOKEN,
  token
})

export const me = me => ({
  type: ME,
  me
})

export const autologin = () => ({
  type: AUTOLOGIN
})

export const autologinSuccess = (token, me) => ({
  type: AUTOLOGIN_SUCCESS,
  token,
  me
})

export const autologinFailed = (error) => ({
  type: AUTOLOGIN_FAILED,
  error
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

export const refreshToken = () => ({
  type: REFRESH_TOKEN
})

export default (state = {token: false, me: false, autologinComplete: false, autologinError: false, error: false, refreshingToken: false}, action) => {
  switch (action.type) {
    case LOGIN:
      return {...state, error: false}
    case LOGIN_FAILED:
      return {...state, error: action.error}
    case AUTHENTICATE:
      return {...state, token: action.token, me: action.me}
    case LOGOUT:
      return {...state, token: false, me: false}
    case TOKEN:
      return {...state, token: action.token, refreshingToken: false}
    case ME:
      return {...state, me: action.me}
    case AUTOLOGIN_SUCCESS:
      return {...state, autologinComplete: true, token: action.token, me: action.me}
    case AUTOLOGIN_FAILED:
      return {...state, autologinComplete: true, autologinError: action.error}
    case ME_UPDATED:
      return {...state, me: state.me.updated({[action.property]: action.value})}
    case REFRESH_TOKEN:
      return {...state, refreshingToken: true}
    default:
      return state
  }
}
