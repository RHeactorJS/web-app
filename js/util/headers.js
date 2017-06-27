/* global Headers */

export const accept = mimeType => {
  const h = new Headers()
  h.append('Accept', mimeType)
  h.append('Content-Type', `${mimeType}; charset=utf-8'`)
  return h
}
