import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { User, JsonWebToken } from '@rheactorjs/models'
import { REGISTER, registerSuccess, registerFailed, ACTIVATE, activationSuccess, activationError } from './actions'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User.fromJSON)
  return ({dispatch}) => next => action => {
    switch (action.type) {
      case REGISTER:
        next(action)
        const {email, password, firstname, lastname} = action
        return apiClient.index()
          .then(index => JSONLD.getRelLink('register', index))
          .then(uri => userClient.create(uri, {email, password, firstname, lastname}))
          .then(() => dispatch(registerSuccess()))
          .catch(err => dispatch(registerFailed(err)))
      case ACTIVATE:
        const {token} = action
        next(action)
        return apiClient.index()
          .then(index => JSONLD.getRelLink('activate-account', index))
          .then(uri => userClient.create(uri, {}, new JsonWebToken(token)))
          .then(() => dispatch(activationSuccess()))
          .catch(err => dispatch(activationError(err)))
      default:
        return next(action)
    }
  }
}
