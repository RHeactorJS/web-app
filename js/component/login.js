import React from 'react'
import classNames from 'classnames'
import { Link, Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../util/is-email'
import { HttpProblem, JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { API } from '../service/api'

const validate = values => ({
  email: !values.email || !isEmail(values.email),
  password: !values.password || values.password.length < 8
})

const renderField = ({input, id, label, placeholder, tabIndex, required, disabled, type, meta: {dirty, error}}) => (
  <fieldset className={classNames({'form-group': true, 'has-success': dirty && !error, 'has-danger': dirty && error})}>
    <label htmlFor={id}>{label}</label>
    <input {...input}
           type={type}
           placeholder={placeholder}
           tabIndex={tabIndex}
           required={required}
           disabled={disabled}
           className={classNames({
             'form-control': true,
             'form-control-success': dirty && !error,
             'form-control-danger': dirty && error
           })}
    />
  </fieldset>
)

const LoginForm = reduxForm({
  form: 'login',
  validate
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, from}) => {
  let disableInput = submitting
  let disableButton = submitting || !valid

  const buttonIconClass = {'material-icons': true, spin: submitting}
  let buttonIconSymbol
  if (!valid) {
    buttonIconSymbol = 'block'
  } else if (submitting) {
    buttonIconSymbol = 'block'
  } else if (submitFailed) {
    buttonIconSymbol = 'error'
  } else if (submitSucceeded) {
    buttonIconSymbol = 'check_ok'
  } else {
    buttonIconSymbol = 'send'
  }

  let warning = null
  if (from === 'TokenExpiredError') {
    warning = (
      <div className='alert alert-warning' role='alert'>
        <p>Your login token expired, so we have logged you out.</p>
      </div>
    )
  }
  if (from === 'logout') {
    warning = (
      <div className='alert alert-success' role='alert'>
        <p>You have been logged out …</p>
      </div>
    )
  }

  let errorMessage
  if (error) {
    switch (error.title) {
      case 'EntryNotFoundError':
        errorMessage = <EntryNotFoundError />
        break
      case 'AccessDeniedError':
        errorMessage = <AccessDeniedError />
        break
      default:
        errorMessage = <GenericError problem={error}/>
    }
  }

  return (
    <div className='container'>
      <article className='row'>
        <section className='col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
          <form name='form' className='card' onSubmit={ handleSubmit }>
            <div className='card-header'>
              <h1 className='card-title'>
                {
                  submitSucceeded
                    ? <i className='material-icons success'>check_circle</i>
                    : <i className='material-icons'>person</i>
                }
                Login
              </h1>
            </div>
            <div className='card-block'>
              {warning}
              <p className='card-text'>
                Please enter your email address and password in order to log in.
              </p>
              <Field
                component={renderField}
                tabIndex='1'
                type='email'
                required
                placeholder='e.g. "alex@example.com"'
                label='email address'
                disabled={disableInput ? 'disabled' : ''}
                name='email'
                id='email'
                // auto-focus (TODO)
              />
              <p>
                <small>
                  <span>Don't have an account?&nbsp;</span>
                  <Link to='/register' className='text-nowrap'>Create a new one here …</Link>
                </small>
              </p>
              <Field
                component={renderField}
                tabIndex='2'
                type='password'
                required
                label='password'
                disabled={disableInput ? 'disabled' : ''}
                name='password'
                id='password'
              />
              <p>
                <small>
                  <span>Forgot your password?&nbsp;</span>
                  <Link to='/lostPassword' className='text-nowrap'>Request a new one here …</Link>
                </small>
              </p>
            </div>
            <div className='card-footer'>
              <div className='controls'>
                <button type='submit'
                        className='btn btn-primary'
                        disabled={disableButton ? 'disabled' : ''}>
                  <i className={classNames(buttonIconClass)}>{buttonIconSymbol}</i>
                  <span>Login</span>
                </button>
              </div>
              {errorMessage}
            </div>
          </form>
        </section>
      </article>
    </div>
  )
})

const GenericError = ({problem}) => (
  <div className='alert alert-danger' role='alert'>
    <i className='material-icons'>error</i>
    {problem.title}<br />
    <small>{problem.detail}</small>
  </div>
)

const EntryNotFoundError = () => (
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
        <Link to='/lostPassword' className='text-nowrap'>Request a new one here …</Link>
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.token) this.token = nextProps.token
  }

  submit = (values) => {
    this.from = false
    const tokenClient = new GenericModelAPIClient(this.apiClient, JsonWebToken)
    const userClient = new GenericModelAPIClient(this.apiClient, User)
    return this.apiClient.index()
      .then(index => JSONLD.getRelLink('login', index))
      .then(uri => tokenClient.create(uri, values))
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