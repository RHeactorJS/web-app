import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { isEmail } from '../util/is-email'
import { HttpProblem, JsonWebToken, User } from '@rheactorjs/models'
import { URIValue } from '@rheactorjs/value-objects'
import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { API } from '../service/api'
import { formInput, AppButton, FormHeader, GenericError, FormCard } from './form-components'

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
  }

  submit = ({firstname, lastname}) => {
    const userClient = new GenericModelAPIClient(this.apiClient, User)
    let prop, value
    if (firstname !== this.user.firstname) {
      prop = 'firstname'
      value = firstname
    }
    return this.apiClient.index()
      .then(index => JSONLD.getRelLink(`update-${prop}`, this.user))
      .then(uri => userClient.update(uri, {value}, this.user.$version, this.token))
      .then(() => this.onUserUpdate(prop, value))
      .catch(err => {
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
      ? <AccountProfileForm onBlur={this.updateValue} onSubmit={this.submit} user={this.user}/>
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}}/>
  }
}

const validate = ({email, password, password2, firstname, lastname}) => ({
  firstname: !firstname || !firstname.length,
  lastname: !lastname || !lastname.length
})

const AccountProfileForm = reduxForm({
  form: 'accountProfile',
  validate
})(({user, submitting, valid, error, submitSucceeded, submitFailed, handleSubmit}) => {
  const onBlur = () => {
    handleSubmit()
  }
  return (
    <FormCard>
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
