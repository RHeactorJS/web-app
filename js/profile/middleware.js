import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { User, JsonWebToken } from '@rheactorjs/models'
import { UPDATE_ME, meUpdated, updateMeFailed, CONFIRM_EMAIL_CHANGE, UPDATE_AVATAR, updateMe, meUpdatePending } from './actions'
import { uploadFileFor, FILE_UPLOAD_SUCCESS } from '../file-upload/actions'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User.fromJSON)
  return ({dispatch, getState}) => next => action => {
    const {auth: {me, token}} = getState()
    switch (action.type) {
      case UPDATE_ME:
        next(action)
        const {property, value} = action
        const isEmailChange = property === 'email'
        const rel = isEmailChange ? 'change-email' : `update-${property}`
        return userClient
          .update(JSONLD.getRelLink(rel, me), {value}, me.$version, token)
          .then(() => dispatch(isEmailChange ? meUpdatePending(property, value) : meUpdated(property, value)))
          .catch(err => dispatch(updateMeFailed(err)))
      case CONFIRM_EMAIL_CHANGE:
        next(action)
        const t = new JsonWebToken(action.token)
        return userClient.update(JSONLD.getRelLink('change-email-confirm', me), {}, me.$version, t)
          .then(() => dispatch(meUpdated('email', t.payload.email)))
          .catch(err => dispatch(updateMeFailed(err)))
      case UPDATE_AVATAR:
        next(action)
        return dispatch(uploadFileFor(action.file, me))
      case FILE_UPLOAD_SUCCESS:
        next(action)
        if (action.target.$id.equals(me.$id)) dispatch(updateMe('avatar', action.uri.toString()))
        break
      default:
        return next(action)
    }
  }
}
