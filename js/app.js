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
import { LoadUserDataFromClientStorage, ClientStoragePropertyToken, ClientStoragePropertyUser } from './container/ClientStorage'
import Home from './container/Home'
import AppUpdate from './container/AppUpdate'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './state'
import { setConfig } from './state/config'
import { updateStatus } from './state/status'
import { doneLoading } from './state/loading'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Status as StatusModel } from '@rheactorjs/models'

const store = createStore(reducer)

const config = {
  ...window.RHeactorJsAppConfig,
  apiIndex: new URIValue(window.RHeactorJsAppConfig.apiIndex),
  imageService: new URIValue(window.RHeactorJsAppConfig.imageService),
  buildTime: new Date(+window.RHeactorJsAppConfig.buildTime)
}
store.dispatch(setConfig(config))
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

ReactDOM.render(
  <Provider store={store}>
    <Loading />
  </Provider>,
  document.getElementById('app-loading')
)

ReactDOM.render(
  <Provider store={store}>
    <AppUpdate />
  </Provider>,
  document.getElementById('app-update')
)

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
        <LoadUserDataFromClientStorage />
        <ClientStoragePropertyToken name='token' equals={(t1, t2) => t1.token === t2.token} />
        <ClientStoragePropertyUser name='user' equals={(u1, u2) => u1.$id.toString() === u2.$id.toString() && u1.$version === u2.$version} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('main')
)

store.dispatch(doneLoading())

loadFont('//fonts.googleapis.com/css?family=Fira+Sans:400,300', 'webfont-loaded')
