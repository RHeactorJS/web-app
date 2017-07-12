import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { User } from '@rheactorjs/models'
import { FETCH_USERS, fetchedUsers, NAVIGATE_USER_LIST, CREATE_USER, userCreated, userCreateFailed, CREATE_USER_SUCCESS, fetchUsers, CHANGE_USER, changingUser, userChanged, userChangeFailed } from './actions'
import { ConflictError } from '@rheactorjs/errors'
import Promise from 'bluebird'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User.fromJSON)
  return ({dispatch, getState}) => next => action => {
    const token = getState().auth.token
    switch (action.type) {
      case FETCH_USERS:
        next(action)
        return Promise
          .try(() => {
            if (action.query && action.query.$id) {
              return userClient.get(action.query.$id, token)
                .then(user => dispatch(fetchedUsers([user])))
            }
            return apiClient.index().then(index => JSONLD.getListLink(User.$context, index))
              .then(listUri => userClient.list(listUri, action.query, token))
              .then(response => dispatch(fetchedUsers(response)))
          })
      case NAVIGATE_USER_LIST:
        next(action)
        const {list, direction} = action
        return userClient.list(JSONLD.getRelLink(direction, list), {}, token)
          .then(response => dispatch(fetchedUsers(response)))
      case CREATE_USER:
        next(action)
        const {email, firstname, lastname} = action
        return apiClient.index().then(index => JSONLD.getListLink(User.$context, index))
          .then(listUri => userClient.list(listUri, {email}, token))
          .then(response => {
            if (response.items.length) throw new ConflictError('User already exists!')
          })
          .then(() => apiClient.index().then(index => JSONLD.getRelLink('create-user', index)))
          .then(createUri => userClient.create(createUri, {email, firstname, lastname}, token))
          .then(response => dispatch(userCreated()))
          .catch(err => dispatch(userCreateFailed(err)))
      case CREATE_USER_SUCCESS:
        next(action)
        return dispatch(fetchUsers())
      case CHANGE_USER:
        next(action)
        dispatch(changingUser(action.user))
        return userClient.update(JSONLD.getRelLink(`update-${action.property}`, action.user), {value: action.value}, action.user.$version, token)
          .then(() => dispatch(userChanged(action.user, action.property, action.value)))
          .catch(err => dispatch(userChangeFailed(err)))
      default:
        return next(action)
    }
  }
}
