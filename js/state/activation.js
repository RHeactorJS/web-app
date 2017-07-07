const ACTIVATE_SUCCEEDED = 'ACTIVATE_SUCCEEDED'
const ACTIVATE_FAILED = 'ACTIVATE_FAILED'
export const ACTIVATE = 'ACTIVATE'

export const success = () => ({
  type: ACTIVATE_SUCCEEDED
})

export const error = error => ({
  type: ACTIVATE_FAILED,
  error
})

export const activate = token => ({
  type: ACTIVATE,
  token
})

export default (state = {activated: false, error: undefined}, action) => {
  switch (action.type) {
    case ACTIVATE_FAILED:
      return {
        activated: false,
        error: action.error
      }
    case ACTIVATE_SUCCEEDED:
      return {
        activated: true
      }
    default:
      return state
  }
}
