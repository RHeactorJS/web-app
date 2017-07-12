/* global URLSearchParams */

import React from 'react'
import { Redirect } from 'react-router-dom'
import { formInput, GenericError, FormCard, ContainerRow, AppButton } from '../../app/form-components'
import AccessDenied from '../../app/AccessDenied'
import Loading from '../../app/Loading'
import { isEmail } from '../../lib/is-email'
import { URIValue } from '@rheactorjs/value-objects'
import { Field, reduxForm, SubmissionError, initialize } from 'redux-form'
import { fetch, change } from './actions'

export default class AdminEditUserScreen extends React.Component {
  constructor (props) {
    super(props)
    this.componentWillReceiveProps(props)
  }

  componentWillMount () {
    this.fetchUser()
  }

  fetchUser = () => {
    if (this.fetched) return
    if (this.autologinComplete) {
      this.fetched = true
      this.props.dispatch(fetch(this.userId))
    }
  }

  componentWillReceiveProps ({location, autologinComplete, me, user, changing, success, error}) {
    this.pathname = location.pathname
    const id = location.search && new URLSearchParams(location.search).get('id')
    this.userId = new URIValue(decodeURIComponent(id))
    this.autologinComplete = autologinComplete
    this.changing = changing
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.me = me
      this.fetchUser()
    }
    this.user = user
    this.success = success
    this.error = error
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
    console.log('change', prop, value)
    this.props.dispatch(change(this.user, prop, value))
    this.props.dispatch(initialize('adminEditUser', {firstname, lastname, email}))
    return true
  }

  toggleActive = () => {
    this.props.dispatch(change(this.user, 'active', !this.user.active))
    return true
  }

  render () {
    if (!this.autologinComplete) return <Loading>Loading …</Loading>
    if (!this.me) return <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
    if (!this.me.superUser) return <AccessDenied />
    if (!this.user) return <Loading>Loading User …</Loading>
    return (<ContainerRow>
      <AdminEditUserForm
        dispatch={this.props.dispatch}
        changeUser={this.changeUser}
        toggleActive={this.toggleActive}
        user={this.user}
        success={this.success}
        error={this.error}
        changing={this.changing} />
    </ContainerRow>)
  }
}

class AdminEditUserForm extends React.Component {
  constructor (props) {
    super(props)
    this.changeUser = props.changeUser
    this.toggleActive = props.toggleActive
    this.user = props.user
    this.changing = props.changing
    console.log('init form')
    props.dispatch(initialize('adminEditUser', {firstname: props.user.firstname, lastname: props.user.lastname, email: props.user.email.toString()}))
  }

  submitForm = (values) => {
    console.log('submit form', values)
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
    return (<AdminEditUserReduxForm user={this.user} onSubmit={this.submitForm} toggleActive={this.toggleActive} changing={this.changing} />)
  }
}

const validateUserForm = ({firstname, lastname, email}) => ({
  email: !email || !isEmail(email),
  firstname: !firstname || firstname.length < 1,
  lastname: !lastname || lastname.length < 1
})

const AdminEditUserReduxForm = reduxForm({
  form: 'adminEditUser',
  enableReinitialize: true,
  validate: validateUserForm
})(({handleSubmit, submitting, valid, error, submitSucceeded, submitFailed, user, toggleActive, changing}) => (
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
                <AppButton submitting={changing} valid onClick={toggleActive} right icon='block'>deactivate</AppButton>
              </span>
            )}
            { !user.active && (
              <span>
                <i className='material-icons danger'>block</i>
                <span>No</span>
                <AppButton submitting={changing} valid onClick={toggleActive} right icon='check_box'>activate</AppButton>
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
