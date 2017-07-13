import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { User } from '@rheactorjs/models'
import { CHANGE_PASSWORD, newPasswordRequestSuccess, newPasswordRequestFailed, CONFIRM_CHANGE_PASSWORD, confirmNewPasswordRequestSuccess, confirmNewPasswordRequestFailed } from './actions'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User.fromJSON)
  return ({dispatch}) => next => action => {
    switch (action.type) {
      case CHANGE_PASSWORD:
        next(action)
        const {email} = action
        return apiClient.index()
          .then(index => JSONLD.getRelLink('password-change', index))
          .then(uri => userClient.create(uri, {email}))
          .then(() => dispatch(newPasswordRequestSuccess(email)))
          .catch(err => dispatch(newPasswordRequestFailed(err)))
      case CONFIRM_CHANGE_PASSWORD:
        next(action)
        const {password, token} = action
        return apiClient.index()
          .then(index => JSONLD.getRelLink('password-change-confirm', index))
          .then(uri => userClient.create(uri, {password}, token))
          .then(() => dispatch(confirmNewPasswordRequestSuccess()))
          .catch(err => dispatch(confirmNewPasswordRequestFailed(err)))
      default:
        return next(action)
    }
  }
}
