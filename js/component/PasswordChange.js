import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../util/is-email'
import { HttpProblem, JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { API } from '../service/api'
import { formInput, AppButton, FormHeader, GenericError } from './form-components'
import { AccountNotFoundError } from './Login'

const validate = values => ({
  email: !values.email || !isEmail(values.email)
})

const PasswordChangeForm = reduxForm({
  form: 'passwordChange',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed}) => {
  return (
    <div className='container'>
      <article className='row'>
        <section className='col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
          <form name='form' className='card' onSubmit={ handleSubmit }>
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
                  placeholder='e.g. "alex@example.com"'
                  disabled={submitting ? 'disabled' : ''}
                  name='email'
                  id='email'
                  // auto-focus (TODO)
                >email address</Field>
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
        </section>
      </article>
    </div>
  )
})

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
