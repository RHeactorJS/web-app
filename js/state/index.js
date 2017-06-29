import { combineReducers } from 'redux'
import status from './status'
import config from './config'
import loading from './loading'
import auth from './auth'
import { reducer as formReducer } from 'redux-form'

const rheactorJSApp = combineReducers({
  status,
  config,
  loading,
  auth,
  form: formReducer
})

export default rheactorJSApp
export * from './status'
export * from './config'
export * from './loading'
export * from './auth'
