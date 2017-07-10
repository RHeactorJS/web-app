import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { User, JsonWebToken } from '@rheactorjs/models'
import { UPDATE_USER, userUpdated, updateUserFailed, CONFIRM_EMAIL_CHANGE } from './actions'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User)
  return ({dispatch, getState}) => next => action => {
    const {auth: {user, token}} = getState()
    switch (action.type) {
      case UPDATE_USER:
        next(action)
        const {property, value} = action
        const rel = property === 'email' ? 'change-email' : `update-${property}`
        return userClient
          .update(JSONLD.getRelLink(rel, user), {value}, user.$version, token)
          .then(() => dispatch(userUpdated(property, value)))
          .catch(err => dispatch(updateUserFailed(err)))
      case CONFIRM_EMAIL_CHANGE:
        next(action)
        const t = new JsonWebToken(action.token)
        return userClient.update(JSONLD.getRelLink('change-email-confirm', user), {}, user.$version, t)
          .then(() => dispatch(userUpdated('email', t.payload.email)))
          .catch(err => dispatch(updateUserFailed(err)))
      default:
        return next(action)
    }
  }
}
