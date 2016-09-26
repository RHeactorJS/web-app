'use strict'

const HttpProblem = require('../model/http-problem')
const HttpProgress = require('../util/http').HttpProgress
const _cloneDeep = require('lodash/cloneDeep')

function AdminUserController ($rootScope, $timeout, $stateParams, IDService, ClientStorageService, UserService) {
  const self = this
  self.user = false
  self.userCopy = false
  self.p = new HttpProgress()
  self.b = new HttpProgress()
  self.e = new HttpProgress()

  self.p.activity()
  ClientStorageService
    .getValidToken()
    .then(token => UserService.get(IDService.decode($stateParams.id), token))
    .then(user => {
      self.user = user
      self.userCopy = _cloneDeep(user)
      $rootScope.windowTitle = user.name
      self.p.success()
    })
    .catch(HttpProblem, err => {
      self.p.error(err)
    })

  self.toggleActive = () => {
    if (self.b.$active) {
      return
    }
    self.b.activity()
    ClientStorageService
      .getValidToken()
      .then(token => UserService.updateProperty(self.user, 'active', !self.user.active, token))
      .then(() => {
        self.b.success()
      })
      .catch(HttpProblem, (httpProblem) => {
        self.b.error(httpProblem)
      })
  }

  let timeout
  self.updateUserProperty = (property) => {
    if (self.e.$active) {
      return
    }
    if (self.userCopy[property] === self.user[property]) {
      return
    }
    self.e.activity()
    if (timeout) {
      $timeout.cancel(timeout)
      timeout = null
    }
    ClientStorageService
      .getValidToken()
      .then(token => UserService.updateProperty(self.user, property, self.userCopy[property], token))
      .then(user => {
        self.e.success()
        self.user = user
        self.userCopy = _cloneDeep(self.user)
        timeout = $timeout(() => {
          self.e.reset()
        }, 1000)
      })
      .catch(HttpProblem, (httpProblem) => {
        self.e.error(httpProblem)
      })
  }
}

module.exports = AdminUserController
