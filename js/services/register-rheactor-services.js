import {GenericAPIService} from './generic'
import {TokenService} from './token'
import {RefreshTokenService} from './refresh-token'
import {UserService} from './user'
import {StatusService} from './status'
import {ClientStorageService} from './client-storage'
import {IDService} from './id'
import {GoogleAnalyticsService} from './google-analytics'
import {RegistrationModel} from '../model/registration'
import {PasswordChangeModel} from '../model/password-change'
import {PasswordChangeConfirmModel} from '../model/password-change-confirm'
import {User, JsonWebToken} from 'models'
import {RHeactorImageServiceService} from './image-service'
import {URIValue} from 'value-objects'

export const RegisterRHeactorServices = angular => {
  angular
    .module('RHeactorServiceModule', [])
    .factory('LoginService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService, JsonWebToken.$context)
    }])
    .factory('RegistrationService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService, RegistrationModel.$context)
    }])
    .factory('PasswordChangeService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService, PasswordChangeModel.$context)
    }])
    .factory('PasswordChangeConfirmService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService, PasswordChangeConfirmModel.$context)
    }])
    .factory('ActivationService', ['$http', 'APIService', ($http, APIService) => {
      return new GenericAPIService($http, APIService, User.$context)
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
    .factory('IDService', ['$window', '$location', ($window, $location) => {
      return new IDService($window, $location)
    }])
    .factory('GoogleAnalyticsService', ['$rootScope', '$window', '$location', ($rootScope, $window, $location) => {
      return new GoogleAnalyticsService($rootScope, $window, $location)
    }])
    .factory('RHeactorImageServiceService', ['$http', 'APIService', 'FrontendConfig', ($http, APIService, config) => {
      return new RHeactorImageServiceService($http, APIService, new URIValue(config.imageService))
    }])
    .factory('RHeactorConnectionWatchInterceptor', ['$rootScope', $rootScope => ({
      request: config => {
        $rootScope.$emit('connection.ok', config)
        return config
      },
      response: response => {
        $rootScope.$emit('connection.ok', response)
        return response
      },
      requestError: rejection => {
        $rootScope.$emit('connection.error', rejection)
        return rejection
      },
      responseError: rejection => {
        $rootScope.$emit('connection.error', rejection)
        return rejection
      }
    }
    )])
    .config(['$httpProvider', $httpProvider => {
      $httpProvider.interceptors.push('RHeactorConnectionWatchInterceptor')
    }])
}
