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

export const fetchPreviousUsers = usersList => navigateUserList(usersList, 'prev')
export const fetchNextUsers = usersList => navigateUserList(usersList, 'next')

export default (state = {fetchingUsers: false, usersList: false, userQuery: false, creatingUser: false, createUserSuccess: false, createUserError: false}, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {...state, fetchingUsers: true, usersList: false, userQuery: action.query}
    case NAVIGATE_USER_LIST:
      return {...state, fetchingUsers: true, usersList: false, userQuery: false}
    case FETCH_USERS_SUCCESS:
      return {...state, fetchingUsers: false, usersList: action.list}
    case CREATE_USER:
      return {...state, creatingUser: true, createUserError: false, createUserSuccess: false}
    case CREATE_USER_SUCCESS:
      return {...state, creatingUser: false, createUserError: false, createUserSuccess: true}
    case CREATE_USER_ERROR:
      return {...state, creatingUser: false, createUserError: action.error, createUserSuccess: false}
    default:
      return state
  }
}
