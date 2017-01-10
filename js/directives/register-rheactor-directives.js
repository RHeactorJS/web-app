import {BootstrapErrorStatesDirective} from './bootstrap-error-states'
import {AutoFocusDirective} from './auto-focus'
import {IsEmailDirective} from './is-email'
import {AppButtonDirective} from './app-button'
import {MarkDownToHTMLDirective} from './markdown-to-html'

export const RegisterRHeactorDirectives = angular => {
  angular
    .module('RHeactorDirectiveModule', [])
    .directive('bootstrapErrorStates', [() => {
      return BootstrapErrorStatesDirective
    }])
    .directive('autoFocus', ['$window', ($window) => {
      return AutoFocusDirective($window)
    }])
    .directive('isEmail', [() => {
      return IsEmailDirective
    }])
    .directive('appButton', [() => {
      return AppButtonDirective
    }])
    .directive('markdownToHtml', ['$location', '$sanitize', '$sce', ($location, $sanitize, $sce) => {
      return MarkDownToHTMLDirective($location, $sanitize, $sce)
    }])
}
