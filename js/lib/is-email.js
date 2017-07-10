import { EmailValue } from '@rheactorjs/value-objects'

export const isEmail = value => {
  try {
    return (new EmailValue(value)) && true
  } catch (err) {
    return false
  }
}
