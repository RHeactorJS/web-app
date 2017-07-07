import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { User, JsonWebToken } from '@rheactorjs/models'
import { ACTIVATE, success, error } from '../state/activation'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User)
  return ({dispatch}) => next => action => {
    switch (action.type) {
      case ACTIVATE:
        const {token} = action
        next(action)
        return apiClient.index()
          .then(index => JSONLD.getRelLink('activate-account', index))
          .then(uri => userClient.create(uri, {}, new JsonWebToken(token)))
          .then(() => dispatch(success()))
          .catch(err => dispatch(error(err)))
      default:
        return next(action)
    }
  }
}
