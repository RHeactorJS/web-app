import { combineReducers } from 'redux'
import status from './status'
import config from './config'
import loading from './loading'
import auth from './auth'
import activation from './activation'
import accountEmailChangeConfirm from './accountEmailChangeConfirm'
import { reducer as formReducer } from 'redux-form'

const rheactorJSApp = combineReducers({
  status,
  config,
  loading,
  auth,
  activation,
  accountEmailChangeConfirm,
  form: formReducer
})

export default rheactorJSApp
