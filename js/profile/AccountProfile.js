import React from 'react'
import { Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError, initialize } from 'redux-form'
import { isEmail } from '../lib/is-email'
import { EmailValue } from '@rheactorjs/value-objects'
import { formInput, AppButton, FormHeader, GenericError, FormCard, ContainerRow } from '../app/form-components'
import { updateMe } from './actions'

export default class AccountProfileScreen extends React.Component {
  constructor (props) {
    super(props)
    this.pathname = props.location.pathname
    this.autologinComplete = props.autologinComplete
    this.me = props.me
    if (this.me) this.props.dispatch(initialize('accountProfile', {firstname: this.me.firstname, lastname: this.me.lastname}))
  }

  componentWillReceiveProps ({autologinComplete, me, success, error}) {
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.me = me
      this.props.dispatch(initialize('accountProfile', {firstname: me.firstname, lastname: me.lastname}))
    }
    this.success = success
    this.error = error
  }

  changeProfile = ({firstname, lastname}) => {
    let prop, value
    if (firstname !== this.me.firstname) {
      prop = 'firstname'
      value = firstname
    }
    if (lastname !== this.me.lastname) {
      prop = 'lastname'
      value = lastname
    }
    if (!prop) return
    this.props.dispatch(updateMe(prop, value))
    return true
  }

  changeEmail = ({email}) => {
    if (new EmailValue(email).equals(this.me.email)) return
    this.props.dispatch(updateMe('email', email))
    return true
  }

  render () {
    if (!this.autologinComplete) return null
    return this.me
      ? (<ContainerRow>
        <AccountProfileForm updateMe={this.changeProfile} me={this.me} success={this.success} error={this.error} />
        <AccountEmailForm updateMe={this.changeEmail} me={this.me} success={this.success} error={this.error} />
      </ContainerRow>)
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
  }
}

class AccountForm extends React.Component {
  constructor (props) {
    super(props)
    this.updateMe = props.updateMe
    this.me = props.me
  }

  submitForm = (values) => {
    if (!this.updateMe(values)) return
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
    return (<AccountProfileReduxForm me={this.me} onSubmit={this.submitForm} />)
  }
}

const validateProfileForm = ({firstname, lastname}) => ({
  firstname: !firstname || firstname.length < 1,
  lastname: !lastname || lastname.length < 1
})

const AccountProfileReduxForm = reduxForm({
  form: 'accountProfile',
  validate: validateProfileForm
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, me}) => (<FormCard half>
  <form name='form'>
    <div className='card-header'>
      <h1 className='card-title'>
        { me.avatar
          ? <img src={me.avatar} className='avatar' alt={`${me.firstname} ${me.lastname}`} />
          : <i className='material-icons'>person</i>
        }
        {me.firstname} {me.lastname}
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
    return <AccountEmailReduxForm me={this.me} onSubmit={this.submitForm} />
  }
}

const validateEmailForm = ({email}, {me}) => ({
  email: !email || !isEmail(email) || email === me.email.toString()
})

const AccountEmailReduxForm = reduxForm({
  form: 'accountEmail',
  validate: validateEmailForm
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, me}) => (<FormCard half>
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
        <code>{`${me.email}`}</code>.
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
