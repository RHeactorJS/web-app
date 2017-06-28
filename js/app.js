/* global window */

import loadFont from 'meownica-web-fonts-loader'

import { URIValue } from '@rheactorjs/value-objects'
import { API } from './service/api'
import Status from './container/status'
import Loading from './container/loading'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer, { updateStatus, setConfig, doneLoading } from './state'

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

store.dispatch(doneLoading())

loadFont('//fonts.googleapis.com/css?family=Fira+Sans:400,300', 'webfont-loaded')
