export const FETCH_USERS = 'FETCH_USERS'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
export const NAVIGATE_USER_LIST = 'NAVIGATE_USER_LIST'

export const fetchUsers = (query) => ({
  type: FETCH_USERS,
  query
})

export const navigateUserList = (list, direction) => ({
  type: NAVIGATE_USER_LIST,
  list,
  direction
})

export const fetchedUsers = list => ({
  type: FETCH_USERS_SUCCESS,
  list
})

export const fetchPreviousUsers = usersList => navigateUserList(usersList, 'prev')
export const fetchNextUsers = usersList => navigateUserList(usersList, 'next')

export default (state = {fetchingUsers: false, usersList: false, userQuery: false}, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {...state, fetchingUsers: true, usersList: false, userQuery: action.query}
    case NAVIGATE_USER_LIST:
      return {...state, fetchingUsers: true, usersList: false, userQuery: false}
    case FETCH_USERS_SUCCESS:
      return {...state, fetchingUsers: false, usersList: action.list}
    default:
      return state
  }
}
