import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../util/is-email'
import { HttpProblem, JsonWebToken, User } from '@rheactorjs/models'
import { URIValue, EmailValue } from '@rheactorjs/value-objects'
import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { API } from '../service/api'
import { formInput, AppButton, FormHeader, GenericError, FormCard, ContainerRow } from './form-components'

export default class AccountProfileScreen extends React.Component {
  constructor (props) {
    super(props)
    this.apiClient = new API(props.apiIndex, props.mimeType)
    this.pathname = props.location.pathname
    this.token = props.token
    this.user = props.user
    this.autologinComplete = props.autologinComplete
    this.onUserUpdate = props.onUserUpdate
    this.initializeForm = props.initializeForm
    this.userClient = new GenericModelAPIClient(this.apiClient, User)
  }

  submitProfileForm = ({firstname, lastname}) => {
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
    return this.userClient
      .update(JSONLD.getRelLink(`update-${prop}`, this.user), {value}, this.user.$version, this.token)
      .then(() => this.onUserUpdate(prop, value))
      .catch(err => {
        throw new SubmissionError({_error: err})
      })
  }

  submitEmailForm = ({email}) => {
    return this.userClient
      .update(JSONLD.getRelLink('change-email', this.user), {value: email}, this.user.$version, this.token)
      .catch(err => {
        console.log(err)
        throw new SubmissionError({_error: err})
      })
  }

  componentWillReceiveProps ({autologinComplete, user, token}) {
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.user = user
      this.token = token
      if (user) this.initForm()
    }
  }

  componentWillMount () {
    if (this.user) this.initForm()
  }

  initForm () {
    this.initializeForm('accountProfile', {firstname: this.user.firstname, lastname: this.user.lastname})
  }

  render () {
    if (!this.autologinComplete) return null
    return this.user
      ? (<ContainerRow>
        <AccountProfileForm onBlur={this.updateValue} onSubmit={this.submitProfileForm} user={this.user}/>
        <AccountEmailForm onSubmit={this.submitEmailForm} user={this.user}/>
      </ContainerRow>)
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}}/>
  }
}

const validateProfileForm = ({firstname, lastname}) => ({
  firstname: !firstname || firstname.length < 1,
  lastname: !lastname || lastname.length < 1
})

const AccountProfileForm = reduxForm({
  form: 'accountProfile',
  validate: validateProfileForm
})(({user, submitting, error, submitSucceeded, handleSubmit}) => {
  const onBlur = () => {
    handleSubmit()
  }
  return (
    <FormCard half>
      <form name='form' onSubmit={ handleSubmit }>
        <div className='card-header'>
          <h1 className='card-title'>
            { user.avatar
              ? <img src={user.avatar} className='avatar' alt={`${user.firstname} ${user.lastname}`}/>
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
            onBlur={onBlur}
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
            onBlur={onBlur}
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
            { error && <GenericError problem={error}/> }
          </div>
        ) }
      </form>
    </FormCard>
  )
})

const validateEmailForm = ({email}, {user}) => ({
  email: !email || !isEmail(email) || email === user.email.toString()
})

const AccountEmailForm = reduxForm({
  form: 'accountEmail',
  validate: validateEmailForm
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, user}) => (
  <FormCard half>
    <form name='form' onSubmit={ handleSubmit }>
      <FormHeader submitSucceeded={submitSucceeded} icon='person'>Change email address</FormHeader>
      <div className='card-block'>
        { submitSucceeded && (
          <div className='alert alert-success' role='alert'>
            <i className='material-icons'>check_ok</i> Ok, now check your inbox for the confirmation email.
          </div>
        )}
        <p className='card-text'>
          Your current email address is:<br/>
          <code>{`${user.email}`}</code>.
        </p>
        <p className='card-text'>
          In order to change your email, please enter a new email address below.<br/>
          We will send you a confirmation link to the new address.<br/>
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
        { error && <GenericError problem={error}/> }
      </div>
    </form>
  </FormCard>
))
