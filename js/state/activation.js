const ACTIVATION_SUCCEEDED = 'ACTIVATION_SUCCEEDED'
const ACTIVATION_FAILED = 'ACTIVATION_FAILED'

export const success = () => ({
  type: ACTIVATION_SUCCEEDED
})

export const error = (problem) => ({
  type: ACTIVATION_FAILED,
  problem
})

const activation = (state = {activated: false, problem: undefined}, action) => {
  switch (action.type) {
    case ACTIVATION_FAILED:
      return {
        activated: false,
        problem: action.problem
      }
    case ACTIVATION_SUCCEEDED:
      return {
        activated: true
      }
    default:
      return state
  }
}

export default activation
