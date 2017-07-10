import React from 'react'
import { Link } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../lib/is-email'
import { AppButton, ContainerRow, FormCard, FormHeader, formInput, GenericError } from '../app/form-components'
import { register } from './actions'

export default class RegistrationScreen extends React.Component {
  submit = ({email, password, firstname, lastname}) => {
    this.props.dispatch(register(email, password, firstname, lastname))
    return new Promise((resolve, reject) => {
      this.submitPromise = {resolve, reject}
    })
  }

  componentWillReceiveProps ({success, error}) {
    if (success) {
      this.submitPromise.resolve()
    }
    if (error) {
      this.submitPromise.reject(new SubmissionError({_error: error}))
    }
  }

  render () {
    return <RegistrationForm onSubmit={this.submit} />
  }
}

const validate = ({email, password, password2, firstname, lastname}) => ({
  email: !email || !isEmail(email),
  password: !password || password.length < 8,
  password2: password2 !== password,
  firstname: !firstname || firstname.length < 1,
  lastname: !lastname || lastname.length < 1
})

const RegistrationForm = reduxForm({
  form: 'registration',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed}) => (
  <ContainerRow>
    <FormCard>
      <form name='form' className='card' onSubmit={handleSubmit}>
        <FormHeader submitSucceeded={submitSucceeded} icon='person_add'>Registration</FormHeader>
        { submitSucceeded && (
          <div className='card-block'>
            <div className='alert alert-success' role='alert'>
              <p>Awesome, your account has been created!</p>
              <p>
                Before you can log in, we need to verify your email address.<br />
                Please check your inbox and click the link we just sent you.
              </p>
            </div>
          </div>
        )}
        { !submitSucceeded && (
          <div className='card-block'>
            <p className='card-text'>
              Please enter your email address, first and last name and pick a password in order to create a new account.
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
            >
              <p>
                <small>
                  <span>Already have account?&nbsp;</span>
                  <Link to='/login' className='text-nowrap'>Log in here …</Link>
                </small>
              </p>
            </Field>
            <Field
              component={formInput}
              tabIndex='2'
              type='password'
              required
              disabled={submitting ? 'disabled' : ''}
              name='password'
              id='password'
              label='password'
            />
            <Field
              component={formInput}
              tabIndex='3'
              type='password'
              required
              disabled={submitting ? 'disabled' : ''}
              name='password2'
              id='password2'
              label='retype password'
            />
            <Field
              component={formInput}
              tabIndex='4'
              type='text'
              required
              disabled={submitting ? 'disabled' : ''}
              name='firstname'
              id='firstname'
              label='first name'
            />
            <Field
              component={formInput}
              tabIndex='5'
              type='text'
              required
              disabled={submitting ? 'disabled' : ''}
              name='lastname'
              id='lastname'
              label='last name'
            />
          </div>
        )}
        { !submitSucceeded && (
          <div className='card-footer'>
            <div className='controls'>
              <AppButton submitting={submitting} valid={valid} submitFailed={submitFailed}
                submitSucceeded={submitSucceeded}>Register</AppButton>
            </div>
            { error && <GenericError problem={error} /> }
          </div>
        )}
      </form>
    </FormCard>
  </ContainerRow>
))
