export const UPDATE_ME = 'UPDATE_ME'
export const UPDATE_ME_FAILED = 'UPDATE_ME_FAILED_ME'
export const ME_UPDATE_PENDING = 'ME_UPDATE_PENDING'
export const ME_UPDATED = 'ME_UPDATED'
export const CONFIRM_EMAIL_CHANGE = 'CONFIRM_EMAIL_CHANGE'
export const UPDATE_AVATAR = 'UPDATE_AVATAR'

export const updateMe = (property, value) => ({
  type: UPDATE_ME,
  property,
  value
})

export const updateMeFailed = error => ({
  type: UPDATE_ME_FAILED,
  error
})

export const meUpdated = (property, value) => ({
  type: ME_UPDATED,
  property,
  value
})

export const meUpdatePending = (property, value) => ({
  type: ME_UPDATE_PENDING,
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
    case UPDATE_ME:
      return {...state, success: false, error: false}
    case ME_UPDATED:
      return {...state, success: true, error: false}
    case ME_UPDATE_PENDING:
      return {...state, success: true, error: false}
    case UPDATE_ME_FAILED:
      return {...state, success: false, error: action.error}
    default:
      return state
  }
}
