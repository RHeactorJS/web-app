import { combineReducers } from 'redux'
import status from './status'
import config from './config'
import loading from './loading'

const rheactorJSApp = combineReducers({
  status,
  config,
  loading
})

export default rheactorJSApp
export * from './status'
export * from './config'
export * from './loading'
