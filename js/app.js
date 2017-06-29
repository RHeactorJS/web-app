/* global window */

import loadFont from 'meownica-web-fonts-loader'

import { URIValue } from '@rheactorjs/value-objects'
import { API } from './service/api'
import Status from './container/status'
import Loading from './container/loading'
import Navigation from './container/navigation'
import Login from './container/login'
import Logout from './container/logout'
import Home from './container/home'
import AppUpdate from './container/app-update'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer, { updateStatus, setConfig, doneLoading } from './state'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Status as StatusModel } from '@rheactorjs/models'

const store = createStore(reducer)

const config = {
  ...window.RHeactorJsAppConfig,
  apiIndex: new URIValue(window.RHeactorJsAppConfig.apiIndex),
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
        <Route exact path='/register' component={Login} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/logout' component={Logout} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('main')
)

store.dispatch(doneLoading())

loadFont('//fonts.googleapis.com/css?family=Fira+Sans:400,300', 'webfont-loaded')
