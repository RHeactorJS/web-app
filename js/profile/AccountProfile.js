import React from 'react'
import { Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError, initialize } from 'redux-form'
import { isEmail } from '../lib/is-email'
import { EmailValue } from '@rheactorjs/value-objects'
import { formInput, AppButton, FormHeader, GenericError, FormCard, ContainerRow } from '../app/form-components'
import { updateUser } from './actions'

export default class AccountProfileScreen extends React.Component {
  constructor (props) {
    super(props)
    this.pathname = props.location.pathname
  }

  componentWillReceiveProps ({autologinComplete, user, success, error}) {
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.user = user
      this.props.dispatch(initialize('accountProfile', {firstname: user.firstname, lastname: user.lastname}))
    }
    this.success = success
    this.error = error
  }

  changeProfile = ({firstname, lastname}) => {
    let prop, value
    if (firstname !== this.user.firstname) {
      prop = 'firstname'
      value = firstname
    }
    if (lastname !== this.user.lastname) {
      prop = 'lastname'
      value = lastname
    }
    if (!prop) return
    this.props.dispatch(updateUser(prop, value))
    return true
  }

  changeEmail = ({email}) => {
    if (new EmailValue(email).equals(this.user.email)) return
    this.props.dispatch(updateUser('email', email))
    return true
  }

  render () {
    if (!this.autologinComplete) return null
    return this.user
      ? (<ContainerRow>
        <AccountProfileForm updateUser={this.changeProfile} user={this.user} success={this.success} error={this.error} />
        <AccountEmailForm updateUser={this.changeEmail} user={this.user} success={this.success} error={this.error} />
      </ContainerRow>)
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
  }
}

class AccountForm extends React.Component {
  constructor (props) {
    super(props)
    this.updateUser = props.updateUser
    this.user = props.user
  }

  submitForm = (values) => {
    if (!this.updateUser(values)) return
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
}

class AccountProfileForm extends AccountForm {
  render () {
    return (<AccountProfileReduxForm user={this.user} onSubmit={this.submitForm} />)
  }
}

const validateProfileForm = ({firstname, lastname}) => ({
  firstname: !firstname || firstname.length < 1,
  lastname: !lastname || lastname.length < 1
})

const AccountProfileReduxForm = reduxForm({
  form: 'accountProfile',
  validate: validateProfileForm
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, user}) => (<FormCard half>
  <form name='form'>
    <div className='card-header'>
      <h1 className='card-title'>
        { user.avatar
          ? <img src={user.avatar} className='avatar' alt={`${user.firstname} ${user.lastname}`} />
          : <i className='material-icons'>person</i>
        }
        {user.firstname} {user.lastname}
      </h1>
    </div>
    <div className='card-block'>
      <Field
        component={formInput}
        tabIndex='1'
        type='text'
        required
        disabled={submitting ? 'disabled' : ''}
        onBlur={() => { handleSubmit() }}
        name='firstname'
        id='firstname'
        label='first name'
      />
      <Field
        component={formInput}
        tabIndex='2'
        type='text'
        required
        disabled={submitting ? 'disabled' : ''}
        onBlur={() => { handleSubmit() }}
        name='lastname'
        id='lastname'
        label='last name'
      />
    </div>
    { (error || submitSucceeded) && (
      <div className='card-footer'>
        { submitSucceeded && (
          <div className='success-info'>
            <div className='alert alert-success' role='alert'>
              <i className='material-icons'>check_ok</i> Changes saved …
            </div>
          </div>
        )}
        { error && <GenericError problem={error} /> }
      </div>
    ) }
  </form>
</FormCard>))

class AccountEmailForm extends AccountForm {
  render () {
    return <AccountEmailReduxForm user={this.user} onSubmit={this.submitForm} />
  }
}

const validateEmailForm = ({email}, {user}) => ({
  email: !email || !isEmail(email) || email === user.email.toString()
})

const AccountEmailReduxForm = reduxForm({
  form: 'accountEmail',
  validate: validateEmailForm
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, user}) => (<FormCard half>
  <form name='form' onSubmit={handleSubmit}>
    <FormHeader submitSucceeded={submitSucceeded} icon='person'>Change email address</FormHeader>
    <div className='card-block'>
      { submitSucceeded && (
        <div className='alert alert-success' role='alert'>
          <i className='material-icons'>check_ok</i> Ok, now check your inbox for the confirmation email.
        </div>
      )}
      <p className='card-text'>
        Your current email address is:<br />
        <code>{`${user.email}`}</code>.
      </p>
      <p className='card-text'>
        In order to change your email, please enter a new email address below.<br />
        We will send you a confirmation link to the new address.<br />
        After you have clicked this link, your new email address will be activated.
      </p>
      <Field
        component={formInput}
        tabIndex='3'
        type='email'
        required
        disabled={submitting ? 'disabled' : ''}
        name='email'
        id='email'
        label='new email address'
      />
    </div>
    <div className='card-footer'>
      <div className='controls'>
        <AppButton submitting={submitting} valid={valid} submitFailed={submitFailed}
          submitSucceeded={submitSucceeded}>continue</AppButton>
      </div>
      { error && <GenericError problem={error} /> }
    </div>
  </form>
</FormCard>))
