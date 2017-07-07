import { SET_CONFIG } from '../state/config'
import { ClientStorageStore } from '../util/ClientStorageStore'
import { JsonWebToken, User } from '@rheactorjs/models'
import { EntryNotFoundError, ReanimationFailedError, TokenExpiredError } from '@rheactorjs/errors'
import { autologin, AUTOLOGIN, autologinSuccess, autologinFailed, USER_UPDATED, USER, TOKEN, LOGOUT, AUTHENTICATE } from '../state/auth'
import Promise from 'bluebird'

const tokenStorage = new ClientStorageStore('token')
const userStorage = new ClientStorageStore('user')

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
          userStorage.get().then(user => User.fromJSON(user))
        )
        .spread((token, user) => dispatch(autologinSuccess(token, user)))
        .catch(TokenExpiredError, EntryNotFoundError, ReanimationFailedError, err => dispatch(autologinFailed(err)))
    case AUTHENTICATE:
      tokenStorage.set(action.token)
      userStorage.set(action.user)
      return next(action)
    case TOKEN:
      tokenStorage.set(action.token)
      return next(action)
    case USER_UPDATED:
    case USER:
      userStorage.set(getState().auth.user)
      return next(action)
    case LOGOUT:
      userStorage.remove()
      tokenStorage.remove()
      return next(action)
    default:
      return next(action)
  }
}
