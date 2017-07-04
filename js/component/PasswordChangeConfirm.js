/* global URLSearchParams */

import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../util/is-email'
import { HttpProblem, JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { API } from '../service/api'
import { formInput, AppButton, FormHeader, GenericError, FormCard, ContainerRow } from './form-components'
import { AccountNotFoundError } from './Login'

const validate = ({password, password2}) => ({
  password: !password || password.length < 8,
  password2: password2 !== password
})

const PasswordChangeConfirmForm = reduxForm({
  form: 'passwordChangeConfirm',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed}) => (
  <ContainerRow>
    <FormCard>
      <form name='form' onSubmit={ handleSubmit }>
        <FormHeader submitSucceeded={submitSucceeded} icon='settings_backup_restore'>Pick a new password</FormHeader>
        { submitSucceeded && (
          <div className='card-block'>
            <div className='alert alert-success' role='alert'>
              <p>Your password has been updated!</p>
              <p>You can now <Link to='/login' className='text-nowrap'>log in</Link> with your email address and your new password.</p>
            </div>
          </div>
        )}
        { !submitSucceeded && (
          <div className='card-block'>
            <p className='card-text'>
              Please pick a new password.
            </p>
            <Field
              component={formInput}
              tabIndex='1'
              type='password'
              required
              disabled={submitting ? 'disabled' : ''}
              name='password'
              id='password'
              label={'password<br/><small>must be at least 8 characters long</small>'}
              autoFocus
            />
            <Field
              component={formInput}
              tabIndex='2'
              type='password'
              required
              disabled={submitting ? 'disabled' : ''}
              name='password2'
              id='password2'
              label='retype password'
            />
          </div>
        )}
        { !submitSucceeded && (
          <div className='card-footer'>
            <div className='controls'>
              <AppButton submitting={submitting} valid={valid} submitFailed={submitFailed}
                         submitSucceeded={submitSucceeded}>Continue</AppButton>
            </div>
            { error && <GenericError problem={error}/> }
          </div>
        )}
      </form>
    </FormCard>
  </ContainerRow>
))

class PasswordChangeConfirmScreen extends React.Component {
  constructor (props) {
    super(props)
    this.apiClient = new API(props.apiIndex, props.mimeType)
    this.token = props.location.search && new URLSearchParams(props.location.search).get('token')
  }

  submit = ({password}) => {
    const userClient = new GenericModelAPIClient(this.apiClient, User)
    return this.apiClient.index()
      .then(index => JSONLD.getRelLink('password-change-confirm', index))
      .then(uri => userClient.create(uri, {password}, new JsonWebToken(this.token)))
      .catch(err => {
        throw new SubmissionError({_error: err})
      })
  }

  render () {
    return <PasswordChangeConfirmForm onSubmit={this.submit}/>
  }
}

export default PasswordChangeConfirmScreen
