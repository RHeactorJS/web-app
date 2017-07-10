export const CHANGE_PASSWORD = 'CHANGE_PASSWORD'
export const CONFIRM_CHANGE_PASSWORD = 'CONFIRM_CHANGE_PASSWORD'
export const NEW_PASSWORD_REQUEST_SUCCESS = 'NEW_PASSWORD_REQUEST_SUCCESS'
export const NEW_PASSWORD_REQUEST_FAILED = 'NEW_PASSWORD_REQUEST_FAILED'
export const CONFIRM_NEW_PASSWORD_REQUEST_SUCCESS = 'CONFIRM_NEW_PASSWORD_REQUEST_SUCCESS'
export const CONFIRM_NEW_PASSWORD_REQUEST_FAILED = 'CONFIRM_NEW_PASSWORD_REQUEST_FAILED'

export const changePassword = email => ({
  type: CHANGE_PASSWORD,
  email
})

export const newPasswordRequestSuccess = email => ({
  type: NEW_PASSWORD_REQUEST_SUCCESS,
  email
})

export const newPasswordRequestFailed = (error) => ({
  type: NEW_PASSWORD_REQUEST_FAILED,
  error
})

export const confirmNewPasswordRequestSuccess = () => ({
  type: CONFIRM_NEW_PASSWORD_REQUEST_SUCCESS
})

export const confirmNewPasswordRequestFailed = (error) => ({
  type: CONFIRM_NEW_PASSWORD_REQUEST_FAILED,
  error
})

export const confirmChangePassword = (password, token) => ({
  type: CONFIRM_CHANGE_PASSWORD,
  password,
  token
})

export default (state = {requestSuccess: false, requestError: false, confirmSuccess: false, confirmError: false}, action) => {
  switch (action.type) {
    case NEW_PASSWORD_REQUEST_SUCCESS:
      return {...state, requestSuccess: true, requestError: false}
    case NEW_PASSWORD_REQUEST_FAILED:
      return {...state, requestSuccess: false, requestError: action.error}
    case CONFIRM_NEW_PASSWORD_REQUEST_SUCCESS:
      return {...state, confirmSuccess: true, confirmError: false}
    case CONFIRM_NEW_PASSWORD_REQUEST_FAILED:
      return {...state, confirmSuccess: false, confirmError: action.error}
    default:
      return state
  }
}
