export const UPDATE_USER = 'UPDATE_USER'
export const UPDATE_USER_FAILED = 'UPDATE_USER_FAILED_USER'
export const USER_UPDATE_PENDING = 'USER_UPDATE_PENDING'
export const USER_UPDATED = 'USER_UPDATED'
export const CONFIRM_EMAIL_CHANGE = 'CONFIRM_EMAIL_CHANGE'
export const UPDATE_AVATAR = 'UPDATE_AVATAR'

export const updateUser = (property, value) => ({
  type: UPDATE_USER,
  property,
  value
})

export const updateUserFailed = error => ({
  type: UPDATE_USER_FAILED,
  error
})

export const userUpdated = (property, value) => ({
  type: USER_UPDATED,
  property,
  value
})

export const userUpdatePending = (property, value) => ({
  type: USER_UPDATE_PENDING,
  property,
  value
})

export const confirmEmailChange = token => ({
  type: CONFIRM_EMAIL_CHANGE,
  token
})

export const updateAvatar = file => ({
  type: UPDATE_AVATAR,
  file
})

export default (state = {success: false, error: false}, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {...state, success: false, error: false}
    case USER_UPDATED:
      return {...state, success: true, error: false}
    case USER_UPDATE_PENDING:
      return {...state, success: true, error: false}
    case UPDATE_USER_FAILED:
      return {...state, success: false, error: action.error}
    default:
      return state
  }
}
