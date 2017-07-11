import { combineReducers } from 'redux'
import status from './status/actions'
import config from './config/actions'
import loading from './loading/actions'
import auth from './login/actions'
import registration from './registration/actions'
import profile from './profile/actions'
import passwordChange from './password-change/actions'
import fileUpload from './file-upload/actions'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  status,
  config,
  loading,
  auth,
  registration,
  passwordChange,
  profile,
  fileUpload,
  form: formReducer
})
