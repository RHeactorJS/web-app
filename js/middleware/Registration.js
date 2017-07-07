import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { User } from '@rheactorjs/models'
import { REGISTER, registerSuccess, registerFailed } from '../state/registration'

export default apiClient => {
  const userClient = new GenericModelAPIClient(apiClient, User)
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
      default:
        return next(action)
    }
  }
}
