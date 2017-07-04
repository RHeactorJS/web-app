export const EMAIL_CHANGE_SUCCEEDED = 'EMAIL_CHANGE_SUCCEEDED'
const EMAIL_CHANGE_FAILED = 'EMAIL_CHANGE_FAILED'

export const success = email => ({
  type: EMAIL_CHANGE_SUCCEEDED,
  email
})

export const error = problem => ({
  type: EMAIL_CHANGE_FAILED,
  problem
})

const accountEmailChangeConfirm = (state = {confirmed: false, problem: undefined}, action) => {
  switch (action.type) {
    case EMAIL_CHANGE_FAILED:
      return {
        confirmed: false,
        problem: action.problem
      }
    case EMAIL_CHANGE_SUCCEEDED:
      return {
        confirmed: true
      }
    default:
      return state
  }
}

export default accountEmailChangeConfirm
