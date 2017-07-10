/* global FileReader btoa */

import React from 'react'
import { Redirect } from 'react-router-dom'
import { JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { GenericModelAPIClient } from '../lib/generic-api-client'
import { JSONLD } from '../lib/jsonld'
import { API } from '../lib/api'
import { AppButton, ContainerRow, FormCard, FormHeader, GenericError } from '../app/form-components'
import { Progress } from '../app/Progress'
import { ValidationFailedError } from '@rheactorjs/errors'
import Promise from 'bluebird'

const imageServiceContext = new URIValue('https://github.com/RHeactorJS/image-service#Upload')
export default class AccountAvatarScreen extends React.Component {
  constructor (props) {
    super(props)
    this.pathname = props.location.pathname
    this.token = props.token
    this.user = props.user
    this.autologinComplete = props.autologinComplete
    this.onUserUpdate = props.onUserUpdate
    this.onError = props.onError
    this.onUpload = props.onUpload
    this.onSuccess = props.onSuccess
    this.apiClient = new API(props.apiIndex, props.mimeType)
    this.userClient = new GenericModelAPIClient(this.apiClient, User)
    this.tokenClient = new GenericModelAPIClient(this.apiClient, JsonWebToken)
    this.imageService = new API(props.imageServiceIndex, 'application/vnd.rheactorjs.image-service.v1+json')
    this.imageServiceClient = new GenericModelAPIClient(
      this.imageService,
      {$context: imageServiceContext, fromJSON: ({url}) => new URIValue(url)}
    )
  }

  componentWillReceiveProps ({autologinComplete, user, token, uploadedURI, error, file, data}) {
    this.uploadedURI = uploadedURI
    this.error = error
    this.file = file
    this.data = data
    this.autologinComplete = autologinComplete
    this.user = user
    this.token = token
    if (autologinComplete) {
      if (file && data) this.upload()
      if (uploadedURI) this.updateUser()
    }
  }

  updateUser = () => {
    if (this.uploadedURI === this.updatingUser) return
    this.updatingUser = this.uploadedURI
    this.userClient.update(JSONLD.getRelLink('update-avatar', this.user), {value: this.uploadedURI.toString()}, this.user.$version, this.token)
      .then(() => this.onUserUpdate('avatar', this.uploadedURI.toString()))
      .catch(err => this.onError(err))
  }

  upload = () => {
    if (!this.uploading) {
      this.uploading = true
      // Upload it
      Promise
        .join(
          this.apiClient.index().then(index => this.tokenClient.create(JSONLD.getRelLink('create-token', index), {aud: 'image-service'}, this.token)),
          this.imageService.index().then(index => index.$links.filter(l => l.subject.equals(imageServiceContext))).spread(({href}) => href)
        )
        .spread((token, uploadUri) => {
          return this.imageServiceClient.create(uploadUri, {$context: imageServiceContext, image: btoa(this.data), mimeType: this.file.type}, token)
        })
        .then(avatarURI => {
          this.uploading = false
          this.onSuccess(avatarURI, this.user)
          return avatarURI
        })
        .catch(err => {
          this.uploading = false
          this.onError(err)
        })
    }
  }

  progress = () => {
    return this.file ? 50 : false
  }

  filename = () => {
    return this.file ? this.file.name : false
  }

  render () {
    if (!this.autologinComplete) return null
    return this.user
      ? <AccountAvatarForm onFileSelected={this.onFileSelected} error={this.error} progress={this.progress()} filename={this.filename()} avatar={this.user && this.user.avatar} label={this.user && this.user.name} />
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
  }

  onFileSelected = (e) => {
    const file = e.target.files[0]
    if (!file) return this.onError(new ValidationFailedError('No file selected!'))
    const {size, type} = file
    if (!size) return this.onError(new ValidationFailedError('Empty file selected!'))
    if (size > 10 * 1024 * 1024) return this.onError(new ValidationFailedError(`File size (${size}) is too large!`))
    if (!['image/png', 'image/jpeg'].includes(type)) return this.onError(new ValidationFailedError(`File type (${type}) not supported!`))

    const reader = new FileReader()
    reader.onload = upload => {
      this.onUpload(file, upload.target.result)
    }
    reader.readAsBinaryString(file)
  }
}

class AccountAvatarForm extends React.Component {
  constructor (props) {
    super(props)
    this.avatar = props.avatar
    this.label = props.label
    this.result = props.result
    this.submitFailed = props.submitFailed
    this.onFileSelected = props.onFileSelected
  }

  componentWillReceiveProps ({error, progress, filename, avatar}) {
    this.error = error
    this.progress = progress
    this.filename = filename
    this.avatar = avatar
  }

  onButtonClicked = () => {
    this.refs.uploadFile.click()
  }

  render () {
    return (
      <ContainerRow>
        <FormCard>
          <FormHeader icon='portrait'>Change Avatar</FormHeader>
          <div className='card-block'>
            { this.avatar && (
              <div className='avatar-preview'>
                <img src={this.avatar} alt={this.label} /><br />
                {this.label}<br />
                <hr />
              </div>
            )}
            {!(this.progress || this.result) && (
              <div>
                <p>Please select an image to use as the new avatar.<br />
                  <small>We support JPG and PNG up to 10 MB.</small>
                </p>
              </div>
            )}
            {(this.progress && !this.result) && (
              <div>
                <small>Uploading <code>{this.filename}</code> …</small>
                <Progress now={this.progress} />
              </div>
            )}
          </div>
          <div className='card-footer'>
            <input type='file' id='file' style={{display: 'none'}} ref='uploadFile' onChange={this.onFileSelected} />
            <div className='controls'>
              <AppButton submitting={this.progress} valid submitFailed={this.submitFailed}
                onClick={this.onButtonClicked}>Change avatar …</AppButton>
            </div>
            { this.error && <GenericError problem={this.error} /> }
          </div>
        </FormCard>
      </ContainerRow>
    )
  }
}
