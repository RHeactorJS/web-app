import {GenericAPIService} from '../services/generic'
import {URIValueType, URIValue} from '@rheactorjs/value-objects'
import {Index} from '@rheactorjs/models'
import {accept} from '../util/http'

const $context = new URIValue('https://github.com/RHeactorJS/image-service#Upload')
const mimeType = 'application/vnd.rheactorjs.image-service.v1+json'

/**
 * @param $http
 * @param {APIService} apiService
 */
export class RHeactorJSImageServiceService extends GenericAPIService {
  constructor ($http, apiService, imageServiceURI) {
    super($http, apiService, $context)
    URIValueType(imageServiceURI, ['RHeactorJSImageServiceService', 'imageServiceURI:URIValue'])
    this.imageServiceURI = imageServiceURI
  }

  /**
   * @returns {URIValue}
   */
  getUploadURI () {
    return this.$http({
      method: 'GET',
      url: this.imageServiceURI.slashless().append('/index').toString(),
      data: '',
      headers: accept(mimeType).headers
    })
      .then(({data}) => Index.fromJSON(data))
      .then(index => index.$links.filter(l => l.subject.equals($context)))
      .spread(uploadLink => uploadLink.href)
  }

  static get $context () {
    return $context
  }

  static get mimeType () {
    return mimeType
  }
}
