import {GenericAPIService} from './generic'
import {Status} from '@rheactorjs/models'
import {JSONLD} from '../util/jsonld'
import {URIValue} from '@rheactorjs/value-objects'

/**
 * @param $http
 * @param {APIService} apiService */
export class StatusService extends GenericAPIService {
  constructor ($http, apiService) {
    super($http, apiService, Status.$context)
  }

  /**
   * @return {Status}
   */
  status () {
    return this.apiService
      .index()
      .then((index) => super.get(new URIValue(JSONLD.getRelLink('status', index) + '?t=' + Date.now())))
  }
}
