/* global URLSearchParams */

import React from 'react'
import { Link } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { JsonWebToken } from '@rheactorjs/models'
import { formInput, AppButton, FormHeader, GenericError, FormCard, ContainerRow } from '../app/form-components'
import { confirmChangePassword } from './actions'

export default class PasswordChangeConfirmScreen extends React.Component {
  constructor (props) {
    super(props)
    this.token = props.location.search && new JsonWebToken(new URLSearchParams(props.location.search).get('token'))
  }

  submit = ({password}) => {
    this.props.dispatch(confirmChangePassword(password, this.token))
    return new Promise((resolve, reject) => {
      this.submitPromise = {resolve, reject}
    })
  }

  componentWillReceiveProps ({success, error}) {
    if (success) {
      this.submitPromise && this.submitPromise.resolve()
    }
    if (error) {
      this.submitPromise && this.submitPromise.reject(new SubmissionError({_error: error}))
    }
  }

  render () {
    return <PasswordChangeConfirmForm onSubmit={this.submit} />
  }
}

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
      <form name='form' onSubmit={handleSubmit}>
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
              label='password'
              hint='must be at least 8 characters long'
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
            { error && <GenericError problem={error} /> }
          </div>
        )}
      </form>
    </FormCard>
  </ContainerRow>
))
