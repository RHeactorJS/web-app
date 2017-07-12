export const FETCH_USER = 'FETCH_USER'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR'

export const CHANGE_USER = 'CHANGE_USER'
export const CHANGE_USER_SUCCESS = 'CHANGE_USER_SUCCESS'
export const CHANGE_USER_ERROR = 'CHANGE_USER_ERROR'

export const fetch = ($id) => ({
  type: FETCH_USER,
  $id
})

export const fetched = user => ({
  type: FETCH_USER_SUCCESS,
  user
})

export const fetchFailed = (error) => ({
  type: FETCH_USER_ERROR,
  error
})

export const change = (user, property, value) => ({
  type: CHANGE_USER,
  user,
  property,
  value
})

export const changed = (user, property, value) => ({
  type: CHANGE_USER_SUCCESS,
  user,
  property,
  value
})

export const changeFailed = (error) => ({
  type: CHANGE_USER_ERROR,
  error
})

export default (state = {fetching: false, user: false, changing: false, success: false, error: false}, action) => {
  switch (action.type) {
    case FETCH_USER:
      return {...state, fetching: true, user: false}
    case FETCH_USER_SUCCESS:
      return {...state, fetching: false, user: action.user}
    case FETCH_USER_ERROR:
      return {...state, fetching: false, user: false, error: action.error}
    case CHANGE_USER:
      return {...state, changing: true, error: false, success: false}
    case CHANGE_USER_ERROR:
      return {...state, changing: false, error: action.error, success: false}
    case CHANGE_USER_SUCCESS:
      return {...state, changing: false, error: false, success: true, user: action.user.updated({[action.property]: action.value})}
    default:
      return state
  }
}
