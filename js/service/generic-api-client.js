import { URIValueType } from '@rheactorjs/value-objects'
import { JsonWebTokenType, MaybeJsonWebTokenType, VersionNumberType } from '@rheactorjs/models'
import { Boolean as BooleanType, Object as ObjectType } from 'tcomb'
import { APIType } from './api'

export class GenericModelAPIClient {
  /**
   * @param {API} api
   * @param {Model} model
   */
  constructor (api, model) {
    this.api = APIType(api, ['GenericModelAPIClient', 'api:api'])
    this.apiGet = this.api.modelGet.bind(undefined, model)
    this.apiPost = this.api.modelPost.bind(undefined, model)
    this.apiPut = this.api.modelPut.bind(undefined, model)
  }

  /**
   * @param {URIValue} endpoint
   * @param {object} data
   * @param {JsonWebToken} token
   * @param {boolean} fetch Fetch the created model, defaults to true, if false returns the location header value if present
   * @returns {Promise.<Model|String>}
   */
  create (endpoint, data, token = undefined, fetch = false) {
    ObjectType(data, ['GenericModelAPIClient.create', 'data:Object'])
    URIValueType(endpoint, ['GenericModelAPIClient.create', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericModelAPIClient.create', 'token:?JsonWebToken'])
    BooleanType(fetch, ['GenericModelAPIClient.create', 'token:?JsonWebToken'])

    return this.apiPost(endpoint, token, data)
      .then(response => fetch ? this.apiGet(response, token) : response)
  }

  /**
   * @param {URIValue} endpoint
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  get (endpoint, token) {
    URIValueType(endpoint, ['GenericModelAPIClient.get', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericModelAPIClient.get', 'token:?JsonWebToken'])
    return this.apiGet(endpoint, token)
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
    return this.apiPut(endpoint, token, data, version)
  }
}
