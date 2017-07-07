import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { LOGIN, authenticate, loginFailed } from '../state/auth'

export default apiClient => {
  const tokenClient = new GenericModelAPIClient(apiClient, JsonWebToken)
  const userClient = new GenericModelAPIClient(apiClient, User)
  return store => next => action => {
    switch (action.type) {
      case LOGIN:
        const {email, password} = action
        return apiClient.index()
          .then(index => JSONLD.getRelLink('login', index))
          .then(uri => tokenClient.create(uri, {email, password}))
          .then(token => userClient.get(new URIValue(token.sub), token)
            .then(user => next(authenticate(token, user)))
          )
          .catch(err => next(loginFailed(err)))
      default:
        return next(action)
    }
  }
}
