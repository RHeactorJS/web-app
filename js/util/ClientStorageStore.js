/* global window */

import { EntryNotFoundError, ReanimationFailedError } from '@rheactorjs/errors'
import { Promise } from 'bluebird'

export class ClientStorageStore {
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
