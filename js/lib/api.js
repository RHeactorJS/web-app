/* global fetch URL */

import { H } from '../lib/headers'
import { httpProblemfromFetchResponse, httpProblemfromException } from '../lib/http-problem'
import { URIValueType, URIValue } from '@rheactorjs/value-objects'
import { String as StringType, Function as FunctionType, irreducible, maybe, Object as ObjectType } from 'tcomb'
import { ReanimationFailedError } from '@rheactorjs/errors'
import { Index, Status, MaybeJsonWebTokenType, MaybeVersionNumberType } from '@rheactorjs/models'
import Promise from 'bluebird'

const MaybeObjectType = maybe(ObjectType)

const modelFetch = (method, mimeType, model, uri, token, data, version) => {
  StringType(mimeType, ['modelFetch()', 'mimeType:String'])
  FunctionType(model.fromJSON, ['modelFetch()', 'model:Model'])
  URIValueType(uri, ['modelFetch()', 'uri:URIValue'])
  MaybeJsonWebTokenType(token, ['modelFetch()', 'token:?JSONWebToken'])
  MaybeObjectType(data, ['modelFetch()', 'data:?Object'])
  MaybeVersionNumberType(version, ['modelFetch()', 'version:?VersionNumber'])
  const url = new URL(uri.toString())
  let body
  if (data) {
    if (method === 'GET') {
      Object.keys(data).map(k => url.searchParams.append(k, data[k]))
    } else {
      body = JSON.stringify(data)
    }
  }
  const headers = new H().accept(mimeType)
  if (token) headers.auth(token)
  if (version) headers.ifMatch(version)
  return new Promise((resolve, reject) => {
    fetch(url, {method, headers: headers.get(), body})
      .then(res => {
        if (!res.ok) return httpProblemfromFetchResponse(res, `${method} failed!`).then(reject)
        if (res.status >= 400) {
          return httpProblemfromFetchResponse(res, `${method}: Server returned an error ${res.status}!`).then(reject)
        }
        const clength = res.headers.get('Content-Length')
        if (+clength) {
          if (res.headers.get('Content-Type').indexOf(mimeType) === -1) return httpProblemfromFetchResponse(res, 'GET: response has wrong mimeType!').then(reject)
          return res.json().then(data => resolve(model.fromJSON(data)))
        }
        if (res.headers.get('Location')) return resolve(new URIValue(res.headers.get('Location')))
        return resolve()
      })
      .catch(({message}) => reject(httpProblemfromException(new Error(`${method} ${url} failed (${message})`))))
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
    this.modelGet = modelFetch.bind(this, 'GET', mimeType)
    this.modelPost = modelFetch.bind(this, 'POST', mimeType)
    this.modelPut = modelFetch.bind(this, 'PUT', mimeType)
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
    if (!this.indexPromise) {
      this.indexPromise = new Promise((resolve, reject) => {
        this.modelGet(Index, this.apiIndex, undefined, {t: Date.now()})
          .then(resolve)
          .catch(err => {
            this.indexPromise = false
            reject(err)
          })
      })
    }
    return this.indexPromise
  }

  /**
   * @returns {Promise.<Status>}
   */
  status () {
    return this
      .index()
      .then(({$links}) => $links)
      .filter(({rel}) => rel === 'status')
      .spread(statusRelation => this.modelGet(Status, statusRelation.href))
  }
}

export const APIType = irreducible('APIType', x => x instanceof API)
