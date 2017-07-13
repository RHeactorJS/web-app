/* global window */

import loadFont from 'meownica-web-fonts-loader'

import { URIValue } from '@rheactorjs/value-objects'
import { API } from './lib/api'
import Status from './status/StatusContainer'
import Loading from './loading/LoadingContainer'
import Navigation from './navigation/NavigationContainer'
import Login from './login/LoginContainer'
import Logout from './login/LogoutContainer'
import Registration from './registration/RegistrationContainer'
import Activation from './registration/ActivationContainer'
import PasswordChange from './password-change/PasswordChangeContainer'
import PasswordChangeConfirm from './password-change/PasswordChangeConfirmContainer'
import AccountEmailChangeConfirm from './profile/AccountEmailChangeConfirmContainer'
import AccountProfile from './profile/AccountProfileContainer'
import AccountAvatar from './profile/AccountAvatarContainer'
import AdminUsers from './admin/Users/AdminUsersContainer'
import AdminEditUser from './admin/EditUser/AdminEditUserContainer'
import Home from './home/HomeContainer'
import AppUpdate from './app-update/AppUpdateContainer'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import { setConfig } from './config/actions'
import { updateStatus } from './status/actions'
import { doneLoading } from './loading/actions'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Status as StatusModel } from '@rheactorjs/models'
import LoginMiddleware from './login/middleware'
import RegistrationMiddleware from './registration/middleware'
import ClientStorageMiddleware from './client-storage/middleware'
import PasswordChangeMiddleware from './password-change/middleware'
import ProfileMiddleware from './profile/middleware'
import FileUploadMiddleware from './file-upload/middleware'
import AdminUsersMiddleware from './admin/Users/middleware'
import AdminEditUserMiddleware from './admin/EditUser/middleware'
import { autoRefreshToken } from './app/autoRefreshToken'

// Get global configuration from index.html
const config = {
  ...window.RHeactorJsAppConfig,
  apiIndex: new URIValue(window.RHeactorJsAppConfig.apiIndex),
  imageServiceIndex: new URIValue(window.RHeactorJsAppConfig.imageServiceIndex),
  buildTime: new Date(+window.RHeactorJsAppConfig.buildTime)
}

// Init services
const apiClient = new API(config.apiIndex, config.mimeType)
const imageServiceApiClient = new API(config.imageServiceIndex, 'application/vnd.rheactorjs.image-service.v1+json')

// Init redux store
const store = createStore(
  reducer,
  applyMiddleware(
    LoginMiddleware(apiClient),
    RegistrationMiddleware(apiClient),
    PasswordChangeMiddleware(apiClient),
    ProfileMiddleware(apiClient),
    AdminUsersMiddleware(apiClient),
    AdminEditUserMiddleware(apiClient),
    FileUploadMiddleware(apiClient, imageServiceApiClient),
    ClientStorageMiddleware
  )
)

// Make config available
store.dispatch(setConfig(config))

// SHow loading indicator
ReactDOM.render(
  <Provider store={store}>
    <Loading />
  </Provider>,
  document.getElementById('app-loading')
)

// The main app
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Navigation />
        <Route exact path='/' component={Home} />
        <Route exact path='/register' component={Registration} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/logout' component={Logout} />
        <Route exact path='/activate' component={Activation} />
        <Route exact path='/password-change' component={PasswordChange} />
        <Route exact path='/password-change-confirm' component={PasswordChangeConfirm} />
        <Route exact path='/account/profile' component={AccountProfile} />
        <Route exact path='/account/email-change' component={AccountEmailChangeConfirm} />
        <Route exact path='/account/avatar' component={AccountAvatar} />
        <Route exact strict path='/admin/users' component={AdminUsers} />
        <Route exact strict path='/admin/user' component={AdminEditUser} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('main')
)

// Check backend status
const statusEl = document.getElementById('react-status')
if (statusEl) {
  const api = new API(config.apiIndex, config.mimeType)
  ReactDOM.render(
    <Provider store={store}>
      <Status />
    </Provider>,
    statusEl
  )
  // Fetch status once and every minute
  const fetchStatus = () => api.status()
    .then(status => store.dispatch(updateStatus(status)))
    .catch(() => store.dispatch(updateStatus(new StatusModel('error', new Date(), config.version))))
  window.setInterval(fetchStatus, 1000 * 60)
  fetchStatus()
}

// Check if app needs update
ReactDOM.render(
  <Provider store={store}>
    <AppUpdate />
  </Provider>,
  document.getElementById('app-update')
)
// Refresh token on user activity
autoRefreshToken(store)

// Notify loading indicator that we are done
store.dispatch(doneLoading())

// Load webfonts
loadFont('//fonts.googleapis.com/css?family=Fira+Sans:400,300', 'webfont-loaded')
