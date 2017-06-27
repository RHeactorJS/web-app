import {IDParamFilter} from './idparam'

export const RegisterRHeactorJSFilters = angular => {
  angular
    .module('RHeactorJSFilterModule', [])
    .filter('idparam', ['$location', 'IDService', function ($location, IDService) {
      return IDParamFilter($location, IDService)
    }])
}
