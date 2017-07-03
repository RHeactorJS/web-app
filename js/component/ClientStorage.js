/* global window */

import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { HttpProblem, JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { EntryNotFoundError, TokenExpiredError, ReanimationFailedError } from '@rheactorjs/errors'
import Promise from 'bluebird'

export class LoadUserDataFromClientStorage extends React.Component {
  constructor (props) {
    super(props)
    this.onToken = props.onToken
    this.onUser = props.onUser
    this.onAutoLoginComplete = props.onAutoLoginComplete
    this.tokenStorage = new ClientStorageStore('token')
    this.userStorage = new ClientStorageStore('user')
  }

  componentWillMount () {
    const autoLoginComplete =
    this.getValidToken()
      .then(token => this.onToken(token))
      .then(() => this.userStorage.get().then(user => this.onUser(User.fromJSON(user))))
      .then(() => this.onAutoLoginComplete(true))
      .catch(TokenExpiredError, EntryNotFoundError, ReanimationFailedError, err => this.onAutoLoginComplete(false, err))
  }

  /**
   * Retrieves the token and checks that it is not expired
   * @returns {Promise.<JsonWebToken>}
   */
  getValidToken () {
    return this.tokenStorage.get()
      .then(data => {
        return Promise
          .try(() => JsonWebToken.fromJSON(data))
          .catch(TypeError, () => {
            console.debug(`Failed to parse token from "${data}"!`)
          })
      })
      .then(token => {
        if (token.isExpired()) {
          console.debug('Token expired')
          throw new TokenExpiredError(token)
        }
        return token
      })
  }

  render () {
    return null
  }
}

export class ClientStorageProperty extends React.Component {
  constructor (props) {
    super(props)
    this.name = props.name
    this.value = props.value
    this.storage = new ClientStorageStore(this.name)
    this.equals = props.equals || ((x, y) => x === y)
  }

  render () {
    return null
  }

  componentWillReceiveProps ({value}) {
    if (value) {
      if (!this.value || !this.equals(value, this.value)) {
        this.value = value
        this.storage.set(value)
      }
    } else {
      this.storage.remove()
    }
  }
}

class ClientStorageStore {
  /**
   * @param {String} property
   */
  constructor (property) {
    this.property = property
  }

  /**
   * Store a value
   * @param {Object} value
   * @returns {Promise}
   */
  set (value) {
    console.debug('ClientStorageStore', 'set()', this.property, value)
    return Promise
      .try(() => {
        return window.localStorage.setItem(this.property, JSON.stringify(value))
      })
  }

  /**
   * Remove a value
   * @returns {Promise}
   */
  remove () {
    console.debug('ClientStorageStore', 'remove()', this.property)
    return Promise
      .try(() => {
        return window.localStorage.removeItem(this.property)
      })
  }

  /**
   * Retrieve a value
   *
   * @returns {Promise.<Object>}
   * @throws {EntryNotFoundError}
   */
  get () {
    return Promise
      .try(() => {
        let v = window.localStorage.getItem(this.property)
        if (!v) {
          throw new EntryNotFoundError(this.property)
        }
        try {
          return JSON.parse(v)
        } catch (err) {
          console.error('ClientStorageStore', `Failed to reanimate "${this.property}" from: "${v}"`)
          throw new ReanimationFailedError(err)
        }
      })
  }
}
