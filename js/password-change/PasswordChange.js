import React from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../lib/is-email'
import { formInput, AppButton, FormHeader, GenericError, FormCard, ContainerRow } from '../app/form-components'
import { AccountNotFoundError } from '../login/Login'
import { changePassword } from './actions'

export default class PasswordChangeScreen extends React.Component {
  submit = ({email}) => {
    this.props.dispatch(changePassword(email))
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
    return <PasswordChangeForm onSubmit={this.submit} />
  }
}

const validate = ({email}) => ({
  email: !email || !isEmail(email)
})

const PasswordChangeForm = reduxForm({
  form: 'passwordChange',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed}) => (
  <ContainerRow>
    <FormCard>
      <form name='form' onSubmit={handleSubmit}>
        <FormHeader submitSucceeded={submitSucceeded} icon='settings_backup_restore'>Reset your
          password</FormHeader>
        { submitSucceeded && (
          <div className='card-block'>
            <div className='alert alert-success' role='alert'>
              We've sent you a confirmation link. Please check your email inbox.
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
                  return <GenericError problem={error} />
              }
            })()}
          </div>
        )}
      </form>
    </FormCard>
  </ContainerRow>
))
