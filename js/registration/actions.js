const ACTIVATE_SUCCEEDED = 'ACTIVATE_SUCCEEDED'
const ACTIVATE_FAILED = 'ACTIVATE_FAILED'
export const ACTIVATE = 'ACTIVATE'
export const REGISTER = 'REGISTER'
const REGISTER_FAILED = 'REGISTER_FAILED'
const REGISTER_SUCCESS = 'REGISTER_SUCESS'

export const register = (email, password, firstname, lastname) => ({
  type: REGISTER,
  email,
  password,
  firstname,
  lastname
})

export const registerFailed = error => ({
  type: REGISTER_FAILED,
  error
})

export const registerSuccess = () => ({
  type: REGISTER_SUCCESS
})

export const activationSuccess = () => ({
  type: ACTIVATE_SUCCEEDED
})

export const activationError = error => ({
  type: ACTIVATE_FAILED,
  error
})

export const activate = token => ({
  type: ACTIVATE,
  token
})

export default (state = {success: false, error: false, activated: false, activationError: false}, action) => {
  switch (action.type) {
    case REGISTER:
      return {...state, error: false, sucesss: false}
    case REGISTER_FAILED:
      return {...state, error: action.error}
    case REGISTER_SUCCESS:
      return {...state, success: true}
    case ACTIVATE_FAILED:
      return {
        activated: false,
        activationError: action.error
      }
    case ACTIVATE_SUCCEEDED:
      return {
        activated: true
      }
    default:
      return state
  }
}
