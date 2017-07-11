/* global btoa FileReader */

import { GenericModelAPIClient } from '../lib/generic-api-client'
import { URIValue } from '@rheactorjs/value-objects'
import { JsonWebToken } from '@rheactorjs/models'
import { JSONLD } from '../lib/jsonld'
import { ValidationFailedError } from '@rheactorjs/errors'
import { UPLOAD_FILE_FOR, error, uploading, success } from './actions'
import Promise from 'bluebird'

const uploadContent = new URIValue('https://github.com/RHeactorJS/image-service#Upload')

export default (apiClient, imageServiceApiClient) => {
  const tokenClient = new GenericModelAPIClient(apiClient, JsonWebToken)
  return ({dispatch, getState}) => {
    const imageService = new GenericModelAPIClient(
      imageServiceApiClient,
      {$context: uploadContent, fromJSON: ({url}) => new URIValue(url)}
    )
    return next => action => {
      switch (action.type) {
        case UPLOAD_FILE_FOR:
          next(action)
          const {file} = action
          if (!file) return dispatch(error((new ValidationFailedError('No file selected!'))))
          const {size, type} = file
          if (!size) return dispatch(error((new ValidationFailedError('Empty file selected!'))))
          if (size > 10 * 1024 * 1024) return dispatch(error((new ValidationFailedError(`File size (${size}) is too large!`))))
          if (!['image/png', 'image/jpeg'].includes(type)) return dispatch(error((new ValidationFailedError(`File type (${type}) not supported!`))))
          const token = getState().auth.token
          const reader = new FileReader()
          reader.onload = upload => {
            Promise
              .join(
                apiClient.index().then(index => tokenClient.create(JSONLD.getRelLink('create-token', index), {aud: 'image-service'}, token)),
                imageServiceApiClient.index().then(index => index.$links.filter(l => l.subject.equals(uploadContent))).spread(({href}) => href)
              )
              .spread((token, uploadUri) => imageService.create(uploadUri, {$context: uploadContent, image: btoa(upload.target.result), mimeType: file.type}, token))
              .then(uploadedURI => {
                dispatch(success(uploadedURI, action.target))
                return null
              })
              .catch(err => dispatch(error(err)))
          }
          reader.readAsBinaryString(file)
          return dispatch(uploading(file))
        default:
          return next(action)
      }
    }
  }
}
