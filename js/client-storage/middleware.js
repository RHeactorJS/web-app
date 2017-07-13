import { SET_CONFIG } from '../config/actions'
import { ClientStorageStore } from '../lib/ClientStorageStore'
import { JsonWebToken, User } from '@rheactorjs/models'
import { EntryNotFoundError, ReanimationFailedError, TokenExpiredError } from '@rheactorjs/errors'
import { autologin, AUTOLOGIN, autologinSuccess, autologinFailed, ME, TOKEN, LOGOUT, AUTHENTICATE } from '../login/actions'
import { USER_UPDATED } from '../profile/actions'
import Promise from 'bluebird'

const tokenStorage = new ClientStorageStore('token')
const meStorage = new ClientStorageStore('me')

/**
 * Retrieves the token and checks that it is not expired
 * @returns {Promise.<JsonWebToken>}
 */
const getValidToken = () => {
  return tokenStorage.get()
    .then(data => {
      return Promise
        .try(() => JsonWebToken.fromJSON(data))
        .catch(TypeError, () => {
          console.debug(`Failed to parse token from "${data}"!`)
        })
    })
    .then(token => {
      if (token.isExpired()) {
        console.debug('Token expired')
        throw new TokenExpiredError(token)
      }
      return token
    })
}

export default ({dispatch, getState}) => next => action => {
  switch (action.type) {
    case SET_CONFIG:
      next(action)
      return dispatch(autologin())
    case AUTOLOGIN:
      next(action)
      return Promise
        .join(
          getValidToken(),
          meStorage.get().then(me => User.fromJSON(me))
        )
        .spread((token, me) => dispatch(autologinSuccess(token, me)))
        .catch(TokenExpiredError, EntryNotFoundError, ReanimationFailedError, err => dispatch(autologinFailed(err)))
    case AUTHENTICATE:
      tokenStorage.set(action.token)
      meStorage.set(action.me)
      return next(action)
    case TOKEN:
      tokenStorage.set(action.token)
      return next(action)
    case USER_UPDATED:
    case ME:
      next(action)
      return meStorage.set(getState().auth.me)
    case LOGOUT:
      meStorage.remove()
      tokenStorage.remove()
      return next(action)
    default:
      return next(action)
  }
}
