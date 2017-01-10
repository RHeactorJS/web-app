import {GenericAPIService} from './generic'
import {TokenService} from './token'
import {RefreshTokenService} from './refresh-token'
import {UserService} from './user'
import {StatusService} from './status'
import {ClientStorageService} from './client-storage'
import {IDService} from './id'
import {GoogleAnalyticsService} from './google-analytics'

export const RegisterRHeactorServices = angular => {
  angular
    .module('RHeactorServiceModule', [])
    .factory('LoginService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService)
    }])
    .factory('RegistrationService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService)
    }])
    .factory('PasswordChangeService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService)
    }])
    .factory('PasswordChangeConfirmService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService)
    }])
    .factory('ActivationService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService)
    }])
    .factory('ClientStorageService', ['$window', '$rootScope', 'APIService', ($window, $rootScope, APIService) => {
      return new ClientStorageService($window, $rootScope, APIService)
    }])
    .factory('UserService', ['$http', 'APIService', ($http, APIService) => {
      return new UserService($http, APIService)
    }])
    .factory('StatusService', ['$http', 'APIService', ($http, APIService) => {
      return new StatusService($http, APIService)
    }])
    .factory('TokenService', ['$http', 'APIService', ($http, APIService) => {
      return new TokenService($http, APIService)
    }])
    .factory('RefreshTokenService', ['TokenService', 'ClientStorageService', (TokenService, ClientStorageService) => {
      return new RefreshTokenService(TokenService, ClientStorageService)
    }])
    .factory('IDService', ['$window', ($window) => {
      return new IDService($window)
    }])
    .factory('GoogleAnalyticsService', ['$rootScope', '$window', '$location', ($rootScope, $window, $location) => {
      return new GoogleAnalyticsService($rootScope, $window, $location)
    }])
}
