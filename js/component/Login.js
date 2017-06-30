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

const validate = values => ({
  email: !values.email || !isEmail(values.email),
  password: !values.password || values.password.length < 8
})

const LoginForm = reduxForm({
  form: 'login',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, from}) => {
  return (
    <div className='container'>
      <article className='row'>
        <section className='col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
          <form name='form' className='card' onSubmit={ handleSubmit }>
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
                placeholder='e.g. "alex@example.com"'
                disabled={submitting ? 'disabled' : ''}
                name='email'
                id='email'
                // auto-focus (TODO)
              >email address</Field>
              <p>
                <small>
                  <span>Don't have an account?&nbsp;</span>
                  <Link to='/register' className='text-nowrap'>Create a new one here …</Link>
                </small>
              </p>
              <Field
                component={formInput}
                tabIndex='2'
                type='password'
                required
                disabled={submitting ? 'disabled' : ''}
                name='password'
                id='password'
              >password</Field>
              <p>
                <small>
                  <span>Forgot your password?&nbsp;</span>
                  <Link to='/password-change' className='text-nowrap'>Request a new one here …</Link>
                </small>
              </p>
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
                    return <GenericError problem={error}/>
                }
              })()}
            </div>
          </form>
        </section>
      </article>
    </div>
  )
})

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

/**
 * FIXME: Implement returnTo
 */
class LoginScreen extends React.Component {
  constructor (props) {
    super(props)
    this.apiClient = new API(props.apiIndex, props.mimeType)
    this.onLogin = props.onLogin
    this.from = props.location.state && props.location.state.from
    this.token = props.token
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.token) this.token = nextProps.token
  }

  submit = ({email, password}) => {
    this.from = false
    const tokenClient = new GenericModelAPIClient(this.apiClient, JsonWebToken)
    const userClient = new GenericModelAPIClient(this.apiClient, User)
    return this.apiClient.index()
      .then(index => JSONLD.getRelLink('login', index))
      .then(uri => tokenClient.create(uri, {email, password}))
      .then(token => userClient.get(new URIValue(token.sub), token).then(user => this.onLogin(token, user)))
      .catch(err => {
        throw new SubmissionError({_error: err})
      })
  }

  render () {
    return this.token
      ? <Redirect to={{pathname: '/'}}/>
      : <LoginForm onSubmit={this.submit} from={this.from}/>
  }
}

export default LoginScreen
