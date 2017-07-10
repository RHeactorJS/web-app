import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { LOGIN, authenticate, loginFailed } from './actions'

export default apiClient => {
  const tokenClient = new GenericModelAPIClient(apiClient, JsonWebToken)
  const userClient = new GenericModelAPIClient(apiClient, User)
  return ({dispatch}) => next => action => {
    switch (action.type) {
      case LOGIN:
        next(action)
        const {email, password} = action
        return apiClient.index()
          .then(index => JSONLD.getRelLink('login', index))
          .then(uri => tokenClient.create(uri, {email, password}))
          .then(token => userClient.get(new URIValue(token.sub), token)
            .then(user => dispatch(authenticate(token, user)))
          )
          .catch(err => dispatch(loginFailed(err)))
      default:
        return next(action)
    }
  }
}
