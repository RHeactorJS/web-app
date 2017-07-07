/* global window */

import loadFont from 'meownica-web-fonts-loader'

import { URIValue } from '@rheactorjs/value-objects'
import { API } from './service/api'
import Status from './container/status'
import Loading from './container/Loading'
import Navigation from './container/Navigation'
import Login from './container/Login'
import Logout from './container/Logout'
import Registration from './container/Registration'
import Activation from './container/Activation'
import PasswordChange from './container/PasswordChange'
import PasswordChangeConfirm from './container/PasswordChangeConfirm'
import AccountEmailChangeConfirm from './container/AccountEmailChangeConfirm'
import AccountProfile from './container/AccountProfile'
import AccountAvatar from './container/AccountAvatar'
import Home from './container/Home'
import AppUpdate from './container/AppUpdate'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './state'
import { setConfig } from './state/config'
import { updateStatus } from './state/status'
import { doneLoading } from './state/loading'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Status as StatusModel } from '@rheactorjs/models'
import LoginMiddleware from './middleware/Login'
import RegistrationMiddleware from './middleware/Registration'
import ActivationMiddleware from './middleware/Activation'
import ClientStorageMiddleware from './middleware/ClientStorage'

// Get global configuration from index.html
const config = {
  ...window.RHeactorJsAppConfig,
  apiIndex: new URIValue(window.RHeactorJsAppConfig.apiIndex),
  imageServiceIndex: new URIValue(window.RHeactorJsAppConfig.imageServiceIndex),
  buildTime: new Date(+window.RHeactorJsAppConfig.buildTime)
}

// Init services
const apiClient = new API(config.apiIndex, config.mimeType)

// Init redux store
const store = createStore(
  reducer,
  applyMiddleware(
    LoginMiddleware(apiClient),
    RegistrationMiddleware(apiClient),
    ActivationMiddleware(apiClient),
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

// Notify loading indicator that we are done
store.dispatch(doneLoading())

loadFont('//fonts.googleapis.com/css?family=Fira+Sans:400,300', 'webfont-loaded')
