import {LoginModel} from './login'
import {PasswordChangeModel} from './password-change'

export const RegisterRHeactorJSModels = angular => {
  angular
    .module('RHeactorJSModelModule', [])
    .service('LoginModel', () => {
      return LoginModel
    })
    .service('PasswordChangeModel', () => {
      return PasswordChangeModel
    })
}
