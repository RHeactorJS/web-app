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

export default (state = {success: false, error: false}, action) => {
  switch (action.type) {
    case REGISTER:
      return {...state, error: false, sucesss: false}
    case REGISTER_FAILED:
      return {...state, error: action.error}
    case REGISTER_SUCCESS:
      return {...state, success: true}
    default:
      return state
  }
}
