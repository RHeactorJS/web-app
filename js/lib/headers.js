/* global Headers */

export class H {
  headers = new Headers()

  /**
   * @param {string} mimeType
   * @return {H}
   */
  accept = (mimeType) => {
    this.headers.append('Accept', mimeType)
    this.headers.append('Content-Type', `${mimeType}; charset=utf-8`)
    return this
  }

  /**
   * @param {JSONWebToken} token
   * @return {H}
   */
  auth = (token) => {
    this.headers.append('Authorization', `Bearer ${token.token}`)
    return this
  }

  /**
   * @param {string} match
   * @return {H}
   */
  ifMatch = (match) => {
    this.headers.append('If-Match', match)
    return this
  }

  get () {
    return this.headers
  }
}

export const accept = (mimeType) => {
  return new H().accept(mimeType).get()
}
