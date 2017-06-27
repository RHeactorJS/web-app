import {EmailValue} from '@rheactorjs/value-objects'

export const IsEmailDirective = {
  restrict: 'A',
  require: 'ngModel',
  link: function (scope, element, attrs, modelCtrl) {
    modelCtrl.$validators.isEmail = function (modelValue, viewValue) {
      if (!viewValue) {
        return true
      }
      try {
        return (new EmailValue(viewValue)) && true
      } catch (err) {
        return false
      }
    }
  }
}
