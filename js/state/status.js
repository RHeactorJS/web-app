const UPDATE_STATUS = 'UPDATE_STATUS'
const SET_FRONTEND_VERSION = 'SET_FRONTEND_VERSION'

export const updateStatus = status => ({
  type: UPDATE_STATUS,
  status
})

export const setFrontendVersion = version => ({
  type: SET_FRONTEND_VERSION,
  version
})

const status = (state = {frontendVersion: false, status: false}, action) => {
  switch (action.type) {
    case UPDATE_STATUS:
      return {...state, status: action.status}
    case SET_FRONTEND_VERSION:
      return {...state, frontendVersion: action.version}
    default:
      return state
  }
}

export default status
