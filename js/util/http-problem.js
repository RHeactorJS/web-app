import { HttpProblem } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'

/**
 * Converts a http error to an HttpProblem
 *
 * @param fetchResponse
 * @param detail
 * @returns {Promise.<HttpProblem>}
 */
export function httpProblemfromFetchResponse (fetchResponse, detail) {
  return new Promise(resolve => {
    if (/\+json;?/.test(fetchResponse.headers.get('Content-Type'))) {
      return fetchResponse.json().then(resolve)
    } else {
      return resolve({})
    }
  })
    .then(data => {
      if (data && data.$context && data.$context === HttpProblem.$context.toString()) {
        detail += ' (' + data.detail + ')'
        return new HttpProblem(new URIValue(data.type), data.title, data.status, detail)
      }
      const status = fetchResponse.status
      const statusText = `${fetchResponse.statusText} (${fetchResponse.url})`
      const errorURL = `${HttpProblem.$context}#` +
        fetchResponse.status +
        '?statusText=' + encodeURIComponent(statusText) +
        '&detail=' + encodeURIComponent(detail)
      return new HttpProblem(new URIValue(errorURL), statusText, status, detail)
    })
}

/**
 * @param {Error} err
 * @returns {HttpProblem}
 */
export function httpProblemfromException (err) {
  const url = 'https://github.com/RHeactorJS/nucleus/wiki/Exception#' +
    '?statusText=' + encodeURIComponent(err.message) +
    '&detail=' + encodeURIComponent(err)
  return new HttpProblem(new URIValue(url), err.message, 500, JSON.stringify(err))
}
