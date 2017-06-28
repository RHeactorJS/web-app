import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

const LoginScreen = () => {
  const from = ''
  let activity = false // state
  let formValid = false // state
  let submitSuccess = false // state
  let submitError = false // state
  let email = '' //
  let disableInput = !activity // vm.p.$active
  let disableButton = !activity && !formValid // 'form.$invalid || vm.p.$active
  const submit = () => {
    console.log('Submit')
  }
  const problem = false
  /**
   <i className='material-icons' data-ng-show='!(form.$invalid || vm.p.$active || vm.initializing) && vm.p.$pristine'>send</i>
   <i className='material-icons spin' data-ng-show='vm.p.$active'>hourglass_empty</i> <i className='material-icons'
   data-ng-show='!(form.$invalid || vm.p.$active || vm.initializing) && vm.p.$success'>check_ok</i> <i className='material-icons'
   data-ng-show='!(form.$invalid || vm.p.$active || vm.initializing) && vm.p.$error'>error</i>
   */
  const buttonIconClass = {'material-icons': true, spin: activity}
  let buttonIconSymbol
  if (!formValid) {
    buttonIconSymbol = 'block'
  } else if (activity) {
    buttonIconSymbol = 'block'
  } else if (submitSuccess) {
    buttonIconSymbol = 'check_ok'
  } else if (submitError) {
    buttonIconSymbol = 'error'
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

  let error
  if (problem) {
    switch (problem.title) {
      case 'EntryNotFoundError':
        error = <AccountNotFoundError email={email} />
        break
      case 'AccessDeniedError':
        error = <AccessDeniedError />
        break
      default:
        error = <GenericError problem={problem} />
    }
  }

  return (
    <div className='container'>
      <article className='row'>
        <section className='col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
          <form name='form' className='card'>
            <div className='card-header'>
              <h1 className='card-title'>
                {
                  submitSuccess
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
              <fieldset className='form-group'>
                <label htmlFor='email'>email address</label>
                <input tabIndex='1'
                  className='form-control'
                  type='email'
                  id='email'
                  required
                  // bootstrap-error-states (TODO)
                  // is-email (TODO)
                  disabled={disableInput ? 'disabled' : ''}
                  name='email'
                  // auto-focus (TODO)
                />
                <p>
                  <small>
                    Don't have an account?
                    <Link to='/register' className='text-nowrap'>Create a new one here …</Link>
                  </small>
                </p>
              </fieldset>
              <fieldset className='form-group'>
                <label htmlFor='password'>
                  password
                </label>
                <input tabIndex='2'
                  className='form-control'
                  type='password'
                  id='password'
                  required
                       // bootstrap-error-states (TODO)
                  minLength={8}
                  disabled={disableInput ? 'disabled' : ''}
                  name='password'
                />
                <p>
                  <small>
                    Forgot your password?
                    <Link to='/lostPassword' className='text-nowrap'>Request a new one here …</Link>
                  </small>
                </p>
              </fieldset>
            </div>
            <div className='card-footer'>
              <div className='controls'>
                <button type='submit'
                  className='btn btn-primary'
                  disabled={disableButton ? 'disabled' : ''}
                  onClick={submit}>
                  <i className={classNames(buttonIconClass)}>{buttonIconSymbol}</i>
                  <span>Login</span>
                </button>
              </div>
              {error}
            </div>
          </form>
        </section>
      </article>
    </div>
  )
}

LoginScreen.navigationOptions = {
  title: 'Log In'
}

const GenericError = ({problem}) => (
  <div className='alert alert-danger' role='alert'>
    <i className='material-icons'>error</i>
    {problem.title}<br />
    <small>{problem.detail}</small>
  </div>
)

const AccountNotFoundError = (email, navigation) => (
  <div>
    <div className='alert alert-danger' role='alert'>
      <p>
        <i className='material-icons'>error</i>
        We could not find an user account with the email <em>{email}</em>.
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

const AccessDeniedError = (navigation) => (
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

export default LoginScreen
