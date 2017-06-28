import { combineReducers } from 'redux'
import status from './status'
import config from './config'
import loading from './loading'
import { reducer as formReducer } from 'redux-form'

const rheactorJSApp = combineReducers({
  status,
  config,
  loading,
  form: formReducer
})

export default rheactorJSApp
export * from './status'
export * from './config'
export * from './loading'
