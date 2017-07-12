import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { LOGIN, authenticate, loginFailed, REFRESH_TOKEN, token } from './actions'

export default apiClient => {
  const tokenClient = new GenericModelAPIClient(apiClient, JsonWebToken.fromJSON)
  const userClient = new GenericModelAPIClient(apiClient, User.fromJSON)
  return ({dispatch, getState}) => next => action => {
    switch (action.type) {
      case LOGIN:
        next(action)
        const {email, password} = action
        return apiClient.index()
          .then(index => JSONLD.getRelLink('login', index))
          .then(uri => tokenClient.create(uri, {email, password}))
          .then(token => userClient.get(new URIValue(token.sub), token)
            .then(me => dispatch(authenticate(token, me)))
          )
          .catch(err => dispatch(loginFailed(err)))
      case REFRESH_TOKEN:
        const refreshingToken = getState().auth.refreshingToken
        const currentToken = getState().auth.token
        next(action)
        if (refreshingToken) return
        return tokenClient.create(JSONLD.getRelLink('token-renew', currentToken), {}, currentToken)
          .then(newToken => dispatch(token(newToken)))
      default:
        return next(action)
    }
  }
}
