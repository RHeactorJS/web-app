const DONE_LOADING = 'DONE_LOADING'

export const doneLoading = () => ({
  type: DONE_LOADING
})

export default (state = false, action) => {
  switch (action.type) {
    case DONE_LOADING:
      return false
    default:
      return state
  }
}
