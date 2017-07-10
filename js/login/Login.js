import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../lib/is-email'
import { formInput, AppButton, FormHeader, GenericError, FormCard, ContainerRow } from '../app/form-components'
import { login } from './actions'

export default class LoginScreen extends React.Component {
  constructor (props) {
    super(props)
    this.from = props.location.state && props.location.state.from
    this.returnTo = props.location.returnTo || '/'
  }

  componentWillReceiveProps ({token, error}) {
    if (token) {
      this.token = token
      this.submitPromise && this.submitPromise.resolve()
    }
    if (error) {
      this.submitPromise && this.submitPromise.reject(new SubmissionError({_error: error}))
    }
  }

  submit = ({email, password}) => {
    this.from = false
    this.props.dispatch(login(email, password))
    return new Promise((resolve, reject) => {
      this.submitPromise = {resolve, reject}
    })
  }

  render () {
    return this.token
      ? <Redirect to={{pathname: this.returnTo}} />
      : <LoginForm onSubmit={this.submit} from={this.from} />
  }
}

const validate = ({email, password}) => ({
  email: !email || !isEmail(email),
  password: !password || password.length < 8
})

const LoginForm = reduxForm({
  form: 'login',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, from}) => (
  <ContainerRow>
    <FormCard>
      <form name='form' onSubmit={handleSubmit}>
        <FormHeader submitSucceeded={submitSucceeded} icon='person'>Login</FormHeader>
        <div className='card-block'>
          {{
            'TokenExpiredError': (
              <div className='alert alert-warning' role='alert'>
                <p>Your login token expired, so we have logged you out.</p>
              </div>
            ),
            'logout': (
              <div className='alert alert-success' role='alert'>
                <p>You have been logged out …</p>
              </div>
            )
          }[from]}
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
          >
            <p>
              <small>
                <span>Don't have an account?&nbsp;</span>
                <Link to='/register' className='text-nowrap'>Create a new one here …</Link>
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
          >
            <p>
              <small>
                <span>Forgot your password?&nbsp;</span>
                <Link to='/password-change' className='text-nowrap'>Request a new one here …</Link>
              </small>
            </p>
          </Field>
        </div>
        <div className='card-footer'>
          <div className='controls'>
            <AppButton submitting={submitting} valid={valid} submitFailed={submitFailed}
              submitSucceeded={submitSucceeded}>Login</AppButton>
          </div>
          { error && (() => {
            switch (error.title) {
              case 'EntryNotFoundError':
                return <AccountNotFoundError />
              case 'AccessDeniedError':
                return <AccessDeniedError />
              default:
                return <GenericError problem={error} />
            }
          })()}
        </div>
      </form>
    </FormCard>
  </ContainerRow>
))

export const AccountNotFoundError = () => (
  <div>
    <div className='alert alert-danger' role='alert'>
      <p>
        <i className='material-icons'>error</i>
        We could not find an user account with that email.
      </p>
    </div>
    <div className='alert alert-warning alert-small' role='alert'>
      <p>
        <i className='material-icons'>help_outline</i>
        <Link to='/register' className='text-nowrap'>Create a new one here …</Link>
      </p>
    </div>
  </div>
)

const AccessDeniedError = () => (
  <div>
    <div className='alert alert-danger' role='alert'>
      <p>
        <i className='material-icons'>error</i>
        You have provided an invalid password!
      </p>
    </div>
    <div className='alert alert-warning alert-small' role='alert'>
      <p>
        <i className='material-icons'>help_outline</i>
        <span>Forgot your password?&nbsp;</span>
        <Link to='/password-change' className='text-nowrap'>Request a new one here …</Link>
      </p>
    </div>
  </div>
)
