/* global window */

import loadFont from 'meownica-web-fonts-loader'

import { URIValue } from '@rheactorjs/value-objects'
import { API } from './service/api'
import Status from './container/status'
import Loading from './container/loading'
import Navigation from './container/navigation'
import Login from './container/login'
import AppUpdate from './container/app-update'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer, { updateStatus, setConfig, doneLoading } from './state'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const store = createStore(reducer)

const config = window.RHeactorJsAppConfig
store.dispatch(setConfig(config))
const statusEl = document.getElementById('react-status')
const api = new API(new URIValue(config.apiIndex), config.mimeType)
if (statusEl) {
  ReactDOM.render(
    <Provider store={store}>
      <Status />
    </Provider>,
    statusEl
  )
  // Fetch status once and every minute
  const fetchStatus = () => api.status().then(status => store.dispatch(updateStatus(status)))
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
        <Route exact path='/register' component={Login} />
        <Route exact path='/login' component={Login} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('main')
)

store.dispatch(doneLoading())

loadFont('//fonts.googleapis.com/css?family=Fira+Sans:400,300', 'webfont-loaded')
