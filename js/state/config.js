export const SET_CONFIG = 'SET_CONFIG'

export const setConfig = config => ({
  type: SET_CONFIG,
  config
})

export default (state = false, action) => {
  switch (action.type) {
    case SET_CONFIG:
      return action.config
    default:
      return state
  }
}
