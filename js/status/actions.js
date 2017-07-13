const UPDATE_STATUS = 'UPDATE_STATUS'

export const updateStatus = status => ({
  type: UPDATE_STATUS,
  status
})

export default (state = false, action) => {
  switch (action.type) {
    case UPDATE_STATUS:
      return action.status
    default:
      return state
  }
}
