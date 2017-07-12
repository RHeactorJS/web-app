/* global URLSearchParams */

import React from 'react'
import { Redirect } from 'react-router-dom'
import { formInput, GenericError, FormCard, ContainerRow, AppButton } from '../app/form-components'
import AccessDenied from '../app/AccessDenied'
import Loading from '../app/Loading'
import { isEmail } from '../lib/is-email'
import { URIValue } from '@rheactorjs/value-objects'
import { Field, reduxForm, SubmissionError, initialize } from 'redux-form'
import { fetchUser, changeUser } from './actions'

export default class AdminEditUserScreen extends React.Component {
  constructor (props) {
    super(props)
    this.pathname = props.location.pathname
    const id = props.location.search && new URLSearchParams(props.location.search).get('id')
    this.userId = new URIValue(decodeURIComponent(id))
    this.autologinComplete = props.autologinComplete
    this.me = props.me
    this.fetchingUsers = props.fetchingUsers
    this.user = props.user
  }

  componentWillMount () {
    this.fetchUser()
  }

  fetchUser = () => {
    if (this.fetched) return
    if (this.autologinComplete) {
      this.fetched = true
      this.props.dispatch(fetchUser(this.userId))
    }
  }

  componentWillReceiveProps ({autologinComplete, me, fetchingUsers, user, changingUser}) {
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.me = me
      this.fetchUser()
    }
    this.fetchingUsers = fetchingUsers
    this.changingUser = changingUser
    this.user = user
    if (user) {
      this.props.dispatch(initialize('adminEditUser', user))
    }
  }

  changeUser = ({firstname, lastname, email}) => {
    let prop, value
    if (firstname !== this.user.firstname) {
      prop = 'firstname'
      value = firstname
    }
    if (lastname !== this.user.lastname) {
      prop = 'lastname'
      value = lastname
    }
    if (email !== this.user.email.toString()) {
      prop = 'email'
      value = email
    }
    if (!prop) return
    this.props.dispatch(changeUser(prop, value))
    return true
  }

  toggleActive = () => {
    this.props.dispatch(changeUser(this.user, 'active', !this.user.active))
    return true
  }

  render () {
    if (!this.autologinComplete) return null
    return this.me
      ? (<ContainerRow>
        { this.me.superUser && <AdminEditUserForm changeUser={this.changeUser} toggleActive={this.toggleActive} user={this.user} changingUser={this.changingUser} /> }
        { !this.me.superUser && <AccessDenied />
        }
      </ContainerRow>)
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
  }
}

class AdminEditUserForm extends React.Component {
  constructor (props) {
    super(props)
    this.changeUser = props.changeUser
    this.toggleActive = props.toggleActive
    this.user = props.user
    this.changingUser = props.changingUser
  }

  submitForm = (values) => {
    if (!this.changeUser(values)) return
    return new Promise((resolve, reject) => {
      this.submitPromise = {resolve, reject}
    })
  }

  componentWillReceiveProps ({success, error, user}) {
    if (success) {
      this.submitPromise && this.submitPromise.resolve()
    }
    if (error) {
      this.submitPromise && this.submitPromise.reject(new SubmissionError({_error: error}))
    }
    this.user = user
  }

  render () {
    if (!this.user) return (<Loading>Loading User …</Loading>)
    return (<AdminEditUserReduxForm user={this.user} onSubmit={this.submitForm} toggleActive={this.toggleActive} changingUser={this.changingUser} />)
  }
}

const validateUserForm = ({firstname, lastname, email}) => ({
  email: !email || !isEmail(email),
  firstname: !firstname || firstname.length < 1,
  lastname: !lastname || lastname.length < 1
})

const AdminEditUserReduxForm = reduxForm({
  form: 'adminEditUser',
  validate: validateUserForm
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, user, toggleActive, changingUser}) => (
  <FormCard>
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
        <dl>
          <dt>Activated</dt>
          <dd>
            { user.active && (
              <span>
                <i className='material-icons success'>check_box</i>
                <span>Yes</span>
                <AppButton submitting={changingUser} valid onClick={toggleActive} right icon='block'>deactivate</AppButton>
              </span>
            )}
            { !user.active && (
              <span>
                <i className='material-icons danger'>block</i>
                <span>No</span>
                <AppButton submitting={changingUser} valid onClick={toggleActive} right icon='check_box'>activate</AppButton>
              </span>
            )}
          </dd>
          <dt>SuperUser</dt>
          <dd>
            { user.superUser && (
              <span>
                <i className='material-icons success'>check_box</i>
                <span>Yes</span>
              </span>
            )}
            { !user.superUser && (
              <span>
                <i className='material-icons danger'>block</i>
                <span>No</span>
              </span>
            )}
          </dd>
        </dl>
        <Field
          component={formInput}
          tabIndex='1'
          type='email'
          required
          disabled={submitting ? 'disabled' : ''}
          onBlur={() => { handleSubmit() }}
          name='email'
          id='email'
          label='email address'
        />
        <Field
          component={formInput}
          tabIndex='2'
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
          tabIndex='3'
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
  </FormCard>
))
