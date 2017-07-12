import { GenericModelAPIClient } from '../../lib/generic-api-client'
import { JSONLD } from '../../lib/jsonld'
import { User } from '@rheactorjs/models'
import { FETCH_USER, fetched, fetchFailed, CHANGE_USER, changed, changeFailed } from './actions'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User.fromJSON)
  return ({dispatch, getState}) => next => action => {
    const token = getState().auth.token
    switch (action.type) {
      case FETCH_USER:
        next(action)
        return userClient.get(action.$id, token)
          .then(user => dispatch(fetched(user)))
          .catch(err => dispatch(fetchFailed(err)))
      case CHANGE_USER:
        next(action)
        return userClient.update(JSONLD.getRelLink(`update-${action.property}`, action.user), {value: action.value}, action.user.$version, token)
          .then(() => dispatch(changed(action.user, action.property, action.value)))
          .catch(err => dispatch(changeFailed(err)))
      default:
        return next(action)
    }
  }
}
