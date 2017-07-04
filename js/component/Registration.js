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
      <form name='form' className='card' onSubmit={ handleSubmit }>
        <FormHeader submitSucceeded={submitSucceeded} icon='person_add'>Registration</FormHeader>
        { submitSucceeded && (
          <div className='card-block'>
            <div className='alert alert-success' role='alert'>
              <p>Awesome, your account has been created!</p>
              <p>
                Before you can log in, we need to verify your email address.<br/>
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
            { error && <GenericError problem={error}/> }
          </div>
        )}
      </form>
    </FormCard>
  </ContainerRow>
))

class RegistrationScreen extends React.Component {
  constructor (props) {
    super(props)
    this.apiClient = new API(props.apiIndex, props.mimeType)
  }

  submit = ({email, password, firstname, lastname}) => {
    const userClient = new GenericModelAPIClient(this.apiClient, User)
    return this.apiClient.index()
      .then(index => JSONLD.getRelLink('register', index))
      .then(uri => userClient.create(uri, {email, password, firstname, lastname}))
      .catch(err => {
        throw new SubmissionError({_error: err})
      })
  }

  render () {
    return <RegistrationForm onSubmit={this.submit}/>
  }
}

export default RegistrationScreen
