import Promise from 'bluebird'
import { JSONLD } from '../util/jsonld'
import { MaybeURIValueType, URIValueType } from '@rheactorjs/value-objects'
import { JsonWebTokenType, ListType, MaybeJsonWebTokenType, VersionNumberType } from '@rheactorjs/models'
import { Boolean as BooleanType, Object as ObjectType, String as StringType } from 'tcomb'
import { APIType } from './api'

export class GenericModelAPIClient {
  /**
   * @param {API} api
   * @param {Model} model
   */
  constructor (api, model) {
    this.api = APIType(api, ['GenericModelAPIClient', 'api:api'])
    this.get = this.api.modelGet.bind(undefined, model)
    this.post = this.api.modelPost.bind(undefined, model)
  }

  /**
   * @param {URIValue} endpoint
   * @param {object} data
   * @param {JsonWebToken} token
   * @param {boolean} fetch Fetch the created model, defaults to true, if false returns the location header value if present
   * @returns {Promise.<Model|String>}
   */
  create (endpoint, data, token, fetch = false) {
    ObjectType(data, ['GenericModelAPIClient.create', 'data:Object'])
    URIValueType(endpoint, ['GenericModelAPIClient.create', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericModelAPIClient.create', 'token:?JsonWebToken'])
    BooleanType(fetch, ['GenericModelAPIClient.create', 'token:?JsonWebToken'])

    return this.post(endpoint, token, data)
      .then(response => fetch ? this.get(response, token) : response)
  }

  /**
   * @param {URIValue} endpoint
   * @param {object} query
   * @param {JsonWebToken} token
   * @returns {Promise.<Model|null>}
   */
  query (endpoint, query, token) {
    URIValueType(endpoint, ['GenericModelAPIClient.query', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericModelAPIClient.query', 'token:?JsonWebToken'])
    let config = accept(this.api.mimeType)
    if (token) {
      config.headers = Object.assign(config.headers, auth(token).headers)
    }
    return this.$http.post(endpoint.toString(), query, config)
      .then(response => handleErrorResponses(response))
      .then(response => {
        if (!response.data) return null
        const model = this.api.createModelInstance(response.data)
        this.validateModelContext(model)
        return model
      })
      .catch(err => err.status, httpError => {
        throw httpProblemfromFetchError(httpError, 'Query to ' + endpoint + ' failed!')
      })
  }

  /**
   * @param {URIValue} endpoint
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  get (endpoint, token) {
    URIValueType(endpoint, ['GenericModelAPIClient.get', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericModelAPIClient.get', 'token:?JsonWebToken'])
    return this.get(endpoint, token)
  }

  /**
   * Fetch a list of items from the endpoint
   *
   * @param {URIValue} endpoint
   * @param {Object} query
   * @param {JsonWebToken} token
   * @param {String} expectedContext
   * @returns {Promise.<Model>}
   */
  list (endpoint, query, token, expectedContext) {
    URIValueType(endpoint, ['GenericModelAPIClient.list', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericModelAPIClient.get', 'token:?JsonWebToken'])
    MaybeURIValueType(expectedContext, ['GenericModelAPIClient.list', 'expectedContext:?URIValue'])
    expectedContext = expectedContext || this.modelContext
    let config = accept(this.api.mimeType)
    if (token) {
      config.headers = Object.assign(config.headers, auth(token).headers)
    }
    return this.$http.post(endpoint.toString(), query, config)
      .then(response => handleErrorResponses(response))
      .then(response => {
        if (response.data) {
          let model = this.api.createModelInstance(response.data)
          if (expectedContext) {
            return Promise
              .map(model.items, (model) => {
                this.validateModelContext(model, expectedContext)
              })
              .then(() => {
                return model
              })
          } else {
            return model
          }
        }
        return null
      })
      .catch(err => err.status, err => {
        throw httpProblemfromFetchError(err, 'Fetching of ' + endpoint + ' failed!')
      })
  }

  /**
   * Follow the links in a list
   *
   * @param {List} list
   * @param {String} dir
   * @param {JsonWebToken} token
   * @return {Promise.<appButton>}
   */
  navigateList (list, dir, token) {
    ListType(list, ['GenericModelAPIClient.navigateList', 'list:List'])
    StringType(dir, ['GenericModelAPIClient.navigateList', 'dir:String'])
    MaybeJsonWebTokenType(token, ['GenericModelAPIClient.navigateList', 'token:?JsonWebToken'])
    return this.list(JSONLD.getRelLink(dir, list), {}, token)
      .then(response => handleErrorResponses(response))
  }

  /**
   * Update a resource
   *
   * @param {URIValue} endpoint
   * @param {Object} data
   * @param {Number} version
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  update (endpoint, data, version, token) {
    URIValueType(endpoint, ['GenericModelAPIClient.update', 'endpoint:URIValue'])
    VersionNumberType(version, ['GenericModelAPIClient.update', 'version:VersionNumber'])
    JsonWebTokenType(token, ['GenericModelAPIClient.update', 'token:JsonWebToken'])
    const config = {
      headers: Object.assign(accept(this.api.mimeType).headers, ifMatch(version).headers, auth(token).headers)
    }
    return this.$http.put(endpoint.toString(), data, config)
      .then(response => handleErrorResponses(response))
      .catch(err => err.status, err => {
        throw httpProblemfromFetchError(err, 'Updating of ' + endpoint + ' failed!')
      })
  }

  /**
   * Delete a resource
   *
   * @param {URIValue} endpoint
   * @param {Number} version
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  delete (endpoint, version, token) {
    URIValueType(endpoint, ['GenericModelAPIClient.delete', 'endpoint:URIValue'])
    VersionNumberType(version, ['GenericModelAPIClient.delete', 'version:VersionNumber'])
    JsonWebTokenType(token, ['GenericModelAPIClient.delete', 'token:JsonWebToken'])
    const config = {
      headers: Object.assign(accept(this.api.mimeType).headers, ifMatch(version).headers, auth(token).headers)
    }
    return this.$http.delete(endpoint.toString(), config)
      .then(response => handleErrorResponses(response))
      .catch(err => err.status, err => {
        throw httpProblemfromFetchError(err, 'Updating of ' + endpoint + ' failed!')
      })
  }
}
