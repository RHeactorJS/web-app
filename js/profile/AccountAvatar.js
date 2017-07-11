import React from 'react'
import { Redirect } from 'react-router-dom'
import { AppButton, ContainerRow, FormCard, FormHeader, GenericError } from '../app/form-components'
import { Progress } from '../app/Progress'
import { updateAvatar } from './actions'

export default class AccountAvatarScreen extends React.Component {
  constructor (props) {
    super(props)
    this.pathname = props.location.pathname
    this.autologinComplete = props.autologinComplete
    this.user = props.user
  }

  componentWillReceiveProps ({autologinComplete, user, file, success, error}) {
    this.error = error
    this.autologinComplete = autologinComplete
    this.user = user
    this.success = success
    this.file = file
  }

  progress = () => {
    return this.file ? 50 : false
  }

  filename = () => {
    return this.file ? this.file.name : false
  }

  onFileSelected = (e) => {
    this.props.dispatch(updateAvatar(e.target.files[0]))
  }

  render () {
    if (!this.autologinComplete) return null
    return this.user
      ? <AccountAvatarForm onFileSelected={this.onFileSelected} error={this.error} progress={this.progress()} filename={this.filename()} avatar={this.user && this.user.avatar} label={this.user && this.user.name} />
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
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
