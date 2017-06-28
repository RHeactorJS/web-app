import { combineReducers } from 'redux'
import status from './status'

const rheactorJSApp = combineReducers({
  status
})

export default rheactorJSApp
export * from './status'
