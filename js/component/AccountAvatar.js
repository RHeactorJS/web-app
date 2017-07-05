/* global FileReader */

import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../util/is-email'
import { HttpProblem, JsonWebToken, User } from '@rheactorjs/models'
import { URIValue, EmailValue } from '@rheactorjs/value-objects'
import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { API } from '../service/api'
import { formInput, AppButton, FormHeader, GenericError, FormCard, ContainerRow } from './form-components'
import { Progress } from './Progress'
import { ValidationFailedError } from '@rheactorjs/errors'
import Promise from 'bluebird'

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
    this.apiClient = new API(props.apiIndex, props.mimeType)
    this.userClient = new GenericModelAPIClient(this.apiClient, User)
    this.tokenClient = new GenericModelAPIClient(this.apiClient, JsonWebToken)
    this.imageService = new API(props.imageService, 'application/vnd.rheactorjs.image-service.v1+json')
    this.imageServiceClient = new GenericModelAPIClient(
      this.imageService,
      {$context: new URIValue('https://github.com/RHeactorJS/image-service#Upload'), fromJSON: () => {}}
    )
  }

  componentWillReceiveProps ({autologinComplete, user, token, error, file, data}) {
    this.error = error
    this.file = file
    this.data = data
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.user = user
      this.token = token
    }
    if (file) {
      // Upload it
      Promise
        .join(
          this.apiClient.index().then(index => this.tokenClient.create(JSONLD.getRelLink('create-token', index), {aud: 'image-service'}, this.token)),
          this.imageService.index()
        )
        .spread((token, index) => {
          console.log(index)
        })

    }
  }

  progress = () => {
    return this.file ? 1 : false
  }

  filename = () => {
    return this.file ? this.file.name : false
  }

  render () {
    if (!this.autologinComplete) return null
    return this.user
      ? <AccountAvatarForm onFileSelected={this.onFileSelected} error={this.error} progress={this.progress()} filename={this.filename()} />
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}}/>
  }

  onFileSelected = (e) => {
    const file = e.target.files[0]
    if (!file) return this.onError(new ValidationFailedError('No file selected!'))
    const {name, size, type} = file
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
    this.submitSucceeded = props.submitSucceeded
    this.avatar = props.avatar
    this.label = props.label
    this.result = props.result
    this.submitFailed = props.submitFailed
    this.onFileSelected = props.onFileSelected
  }

  componentWillReceiveProps ({error, progress, filename}) {
    this.error = error
    this.progress = progress
    this.filename = filename
  }

  onButtonClicked = () => {
    this.refs.uploadFile.click()
  }

  render () {
    return (
      <ContainerRow>
        <FormCard>
          <FormHeader icon='portrait' submitSucceeded={this.submitSucceeded}>Change Avatar</FormHeader>
          <div className='card-block'>
            { this.submitSucceeded && (
              <div className='alert alert-success' role='alert'>
                Awesome, the avatar has been updated …
              </div>
            )}
            { this.avatar && (
              <div className='avatar-preview'>
                <img data-ng-src={this.avatar} alt={this.label}/><br />
                {this.label}<br />
                <hr />
              </div>
            )}
            {!(this.progress || this.result) && (
              <div>
                <p>Please select an image to use as the new avatar.<br/>
                  <small>We support JPG and PNG up to 10 MB.</small>
                </p>
              </div>
            )}
            {(this.progress && !this.result) && (
              <div>
                <small>Uploading <code>{this.filename}</code> …</small>
                <Progress now={this.progress}/>
              </div>
            )}
          </div>
          <div className='card-footer'>
            <input type='file' id='file' style={{display: 'none'}} ref='uploadFile' onChange={this.onFileSelected}/>
            <div className='controls'>
              <AppButton submitting={this.progress} valid submitFailed={this.submitFailed}
                         onClick={this.onButtonClicked}
                         submitSucceeded={this.submitSucceeded}>Change avatar …</AppButton>
            </div>
            { this.error && <GenericError problem={this.error}/> }
          </div>
        </FormCard>
      </ContainerRow>
    )
  }
}
