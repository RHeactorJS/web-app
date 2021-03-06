import {URIValue, EmailValueType} from '@rheactorjs/value-objects'

const $context = new URIValue('https://github.com/RHeactorJS/nucleus/wiki/JsonLD#PasswordChange')

export class PasswordChangeModel {
  constructor (email) {
    EmailValueType(email, ['PasswordChangeModel', 'email:EmailValue'])
    this.email = email
    this.$context = $context
  }

  toJSON () {
    return {
      email: this.email.toString()
    }
  }

  static get $context () {
    return $context
  }
}
