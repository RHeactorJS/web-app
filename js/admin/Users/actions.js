export const FETCH_USERS = 'FETCH_USERS'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
export const NAVIGATE_USER_LIST = 'NAVIGATE_USER_LIST'
export const CREATE_USER = 'CREATE_USER'
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS'
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR'

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

export const createUser = (email, firstname, lastname) => ({
  type: CREATE_USER,
  email,
  firstname,
  lastname
})

export const userCreated = () => ({
  type: CREATE_USER_SUCCESS
})

export const userCreateFailed = (error) => ({
  type: CREATE_USER_ERROR,
  error
})

export const fetchPreviousUsers = users => navigateUserList(users, 'prev')
export const fetchNextUsers = users => navigateUserList(users, 'next')

export default (state = {fetching: false, users: false, query: false, creating: false, success: false, error: false}, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {...state, fetching: true, users: false, query: action.query}
    case NAVIGATE_USER_LIST:
      return {...state, fetching: true, users: false, query: false}
    case FETCH_USERS_SUCCESS:
      return {...state, fetching: false, users: action.list}
    case CREATE_USER:
      return {...state, creating: true, error: false, success: false}
    case CREATE_USER_SUCCESS:
      return {...state, creating: false, error: false, success: true}
    case CREATE_USER_ERROR:
      return {...state, creating: false, error: action.error, success: false}
    default:
      return state
  }
}
