/* global window */

import loadFont from 'meownica-web-fonts-loader'

import { URIValue } from '@rheactorjs/value-objects'
import { API } from './service/api'
import { Status } from './component/status'
import React from 'react'
import ReactDOM from 'react-dom'

loadFont('//fonts.googleapis.com/css?family=Fira+Sans:400,300', 'webfont-loaded')

const config = window.RHeactorJsAppConfig
const statusEl = document.getElementById('react-status')
const api = new API(new URIValue(config.apiIndex), config.mimeType)
if (statusEl) {
  ReactDOM.render(
    <Status api={api} frontendVersion={config.version} />,
    statusEl
  )
}
