import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { User } from '@rheactorjs/models'
import { FETCH_USERS, fetchedUsers, NAVIGATE_USER_LIST } from './actions'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User)
  return ({dispatch, getState}) => next => action => {
    const token = getState().auth.token
    switch (action.type) {
      case FETCH_USERS:
        next(action)
        return apiClient.index().then(index => JSONLD.getListLink(User.$context, index))
          .then(listUri => userClient.list(listUri, action.query, token))
          .then(response => dispatch(fetchedUsers(response)))
      case NAVIGATE_USER_LIST:
        next(action)
        const {list, direction} = action
        return userClient.list(JSONLD.getRelLink(direction, list), {}, token)
          .then(response => dispatch(fetchedUsers(response)))
      default:
        return next(action)
    }
  }
}
