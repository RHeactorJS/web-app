import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { User, JsonWebToken } from '@rheactorjs/models'
import { UPDATE_USER, userUpdated, updateUserFailed, CONFIRM_EMAIL_CHANGE, UPDATE_AVATAR, updateUser, userUpdatePending } from './actions'
import { uploadFileFor, FILE_UPLOAD_SUCCESS } from '../file-upload/actions'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User)
  return ({dispatch, getState}) => next => action => {
    const {auth: {user, token}} = getState()
    switch (action.type) {
      case UPDATE_USER:
        next(action)
        const {property, value} = action
        const isEmailChange = property === 'email'
        const rel = isEmailChange ? 'change-email' : `update-${property}`
        return userClient
          .update(JSONLD.getRelLink(rel, user), {value}, user.$version, token)
          .then(() => dispatch(isEmailChange ? userUpdatePending(property, value) : userUpdated(property, value)))
          .catch(err => dispatch(updateUserFailed(err)))
      case CONFIRM_EMAIL_CHANGE:
        next(action)
        const t = new JsonWebToken(action.token)
        return userClient.update(JSONLD.getRelLink('change-email-confirm', user), {}, user.$version, t)
          .then(() => dispatch(userUpdated('email', t.payload.email)))
          .catch(err => dispatch(updateUserFailed(err)))
      case UPDATE_AVATAR:
        next(action)
        return dispatch(uploadFileFor(action.file, user))
      case FILE_UPLOAD_SUCCESS:
        next(action)
        if (action.target.$id.equals(user.$id)) dispatch(updateUser('avatar', action.uri.toString()))
        break
      default:
        return next(action)
    }
  }
}
