import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form'
import { isEmail } from '../util/is-email'
import Promise from 'bluebird'
import { HttpProblem } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { SubmissionError } from 'redux-form'

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

const LoginForm = reduxForm({form: 'login', validate})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed}) => {
  const from = ''
  let disableInput = submitting
  let disableButton = (submitting && !submitFailed) || !valid

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
        errorMessage = <AccountNotFoundError />
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
                  Don't have an account?
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
                  Forgot your password?
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

const AccountNotFoundError = () => (
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
        Forgot your password?
        <Link to='/lostPassword' className='text-nowrap'>Request a new one here …</Link>
      </p>
    </div>
  </div>
)

class LoginScreen extends React.Component {
  submit = (values) => {
    // print the form values to the console
    console.log(values)
    return Promise
      .delay(1000)
      .then(() => {
        if (Math.random() > 0.5) return true
        throw new SubmissionError({
          _error: new HttpProblem(new URIValue('http://example.com'), 'Foo', 400, 'bar')
        })
      })
  }

  render () {
    return (
      <LoginForm onSubmit={this.submit}/>
    )
  }
}

export default LoginScreen
