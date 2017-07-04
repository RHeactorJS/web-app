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

const validate = ({email}) => ({
  email: !email || !isEmail(email)
})

const PasswordChangeForm = reduxForm({
  form: 'passwordChange',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed}) => (
  <ContainerRow>
    <FormCard>
      <form name='form' onSubmit={ handleSubmit }>
        <FormHeader submitSucceeded={submitSucceeded} icon='settings_backup_restore'>Reset your
          password</FormHeader>
        { submitSucceeded && (
          <div className='card-block'>
            <div className="alert alert-success" role="alert">
              <p>We've sent you a confirmation link. Please check your email inbox.</p>
            </div>
          </div>
        )}
        { !submitSucceeded && (
          <div className='card-block'>
            <p className='card-text'>
              Please enter your email address and password in order to log in.
            </p>
            <Field
              component={formInput}
              tabIndex='1'
              type='email'
              required
              disabled={submitting ? 'disabled' : ''}
              name='email'
              id='email'
              label='email address'
              autoFocus
            />
          </div>
        )}
        { !submitSucceeded && (
          <div className='card-footer'>
            <div className='controls'>
              <AppButton submitting={submitting} valid={valid} submitFailed={submitFailed}
                         submitSucceeded={submitSucceeded}>Continue</AppButton>
            </div>
            { error && (() => {
              switch (error.title) {
                case 'EntryNotFoundError':
                  return <AccountNotFoundError />
                default:
                  return <GenericError problem={error}/>
              }
            })()}
          </div>
        )}
      </form>
    </FormCard>
  </ContainerRow>
))

class PasswordChangeScreen extends React.Component {
  constructor (props) {
    super(props)
    this.apiClient = new API(props.apiIndex, props.mimeType)
  }

  submit = ({email}) => {
    const userClient = new GenericModelAPIClient(this.apiClient, User)
    return this.apiClient.index()
      .then(index => JSONLD.getRelLink('password-change', index))
      .then(uri => userClient.create(uri, {email}))
      .catch(err => {
        throw new SubmissionError({_error: err})
      })
  }

  render () {
    return <PasswordChangeForm onSubmit={this.submit}/>
  }
}

export default PasswordChangeScreen
