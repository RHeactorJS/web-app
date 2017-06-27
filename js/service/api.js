/* global fetch */

import { accept } from '../util/headers'
import { httpProblemfromFetchResponse } from '../util/http-problem'
import { URIValueType } from '@rheactorjs/value-objects'
import { String as StringType, Function as FunctionType } from 'tcomb'
import { ReanimationFailedError } from '@rheactorjs/errors'
import { Index, Status } from '@rheactorjs/models'
import Promise from 'bluebird'

let indexPromise

const get = (mimeType, uri, model) => {
  URIValueType(uri, ['get()', 'uri:URIValue'])
  StringType(mimeType, ['get()', 'mimeType:String'])
  FunctionType(model.fromJSON, ['get()', 'model:Model'])
  return new Promise((resolve, reject) => {
    fetch(`${uri}`, {headers: accept(mimeType)})
      .then(res => {
        if (!res.ok) return httpProblemfromFetchResponse(res, 'GET failed!').then(reject)
        if (res.headers.get('Content-Type').indexOf(mimeType) === -1) return httpProblemfromFetchResponse(res, 'GET: response has wrong mimeType!').then(reject)
        res.json().then(data => resolve(model.fromJSON(data)))
      })
      .catch(reject)
  })
}

export class API {
  /**
   * @param {URIValue} apiIndex
   * @param {String} mimeType
   * @returns {API}
   */
  constructor (apiIndex, mimeType) {
    this.apiIndex = URIValueType(apiIndex, ['API()', 'apiIndex:URIValue'])
    this.mimeType = StringType(mimeType, ['API()', 'mimeType:String'])
    this.get = get.bind(undefined, mimeType)
  }

  /**
   * @param {Object} data
   * @returns {Model}
   * @throws {ReanimationFailedError}
   */
  createModelInstance (data) {
    switch (data.$context.toString()) {
      default:
        throw new ReanimationFailedError(`Unknown context: "${data.$context}"!`, data)
    }
  }

  index () {
    if (!indexPromise) {
      indexPromise = new Promise((resolve, reject) => {
        fetch(`${this.apiIndex}?t=${Date.now()}`, {headers: accept(this.mimeType)})
          .then(res => {
            if (!res.ok) return httpProblemfromFetchResponse(res, 'APIService.index() failed!').then(reject)
            if (res.headers.get('Content-Type').indexOf(this.mimeType) === -1) return httpProblemfromFetchResponse(res, 'APIService.index() has wrong mimeType!').then(reject)
            res.json().then(data => resolve(Index.fromJSON(data)))
          })
          .catch(reject)
      })
    }
    return indexPromise
  }

  /**
   * @returns {Promise.<Status>}
   */
  status () {
    return this
      .index()
      .then(({$links}) => $links)
      .filter(({rel}) => rel === 'status')
      .spread(statusRelation => this.get(statusRelation.href, Status))
  }
}
