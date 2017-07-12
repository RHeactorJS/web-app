export const FETCH_USERS = 'FETCH_USERS'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
export const NAVIGATE_USER_LIST = 'NAVIGATE_USER_LIST'
export const CREATE_USER = 'CREATE_USER'
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS'
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR'
export const CHANGE_USER = 'CHANGE_USER'
export const CHANGE_USER_SUCCESS = 'CHANGE_USER_SUCCESS'
export const CHANGE_USER_ERROR = 'CHANGE_USER_ERROR'
export const CHANGING_USER = 'CHANGING_USER'

export const fetchUsers = (query) => ({
  type: FETCH_USERS,
  query
})

export const fetchUser = $id => fetchUsers({$id})

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

export const changeUser = (user, property, value) => ({
  type: CHANGE_USER,
  user,
  property,
  value
})

export const changingUser = user => ({
  type: CHANGING_USER,
  user
})

export const userChanged = (user, property, value) => ({
  type: CHANGE_USER_SUCCESS,
  user,
  property,
  value
})

export const userChangeFailed = (error) => ({
  type: CHANGE_USER_ERROR,
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
    case CHANGE_USER_ERROR:
      return {...state, changingUser: false, changeUserError: action.error, changeUserSuccess: false}
    case CHANGE_USER_SUCCESS:
      return {...state, changingUser: false, changeUserError: false, changeUserSuccess: true, usersList: [action.user.updated({[action.property]: action.value})]}
    case CHANGING_USER:
      return {...state, changingUser: true, changeUserError: false, changeUserSuccess: false}
    default:
      return state
  }
}
