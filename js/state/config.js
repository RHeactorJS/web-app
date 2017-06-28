const SET_CONFIG = 'SET_CONFIG'

export const setConfig = config => ({
  type: SET_CONFIG,
  config
})

const config = (state = false, action) => {
  switch (action.type) {
    case SET_CONFIG:
      return action.config
    default:
      return state
  }
}

export default config
