/* global URLSearchParams */

import React from 'react'
import { Redirect } from 'react-router-dom'
import { RRFField, GenericError, FormCard, ContainerRow, AppButton } from '../../app/form-components'
import AccessDenied from '../../app/AccessDenied'
import Loading from '../../app/Loading'
import { URIValue } from '@rheactorjs/value-objects'
import { fetch, change } from './actions'
import { LocalForm, actions } from 'react-redux-form'

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
    if (this.autologinComplete && this.me) {
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

  toggleActive = () => {
    this.props.dispatch(change(this.user, 'active', !this.user.active))
    return true
  }

  attachDispatch = formDispatch => {
    this.formDispatch = formDispatch
  }

  getFormModel = () => ({firstname: this.user.firstname, lastname: this.user.lastname, email: this.user.email.toString()})

  handleUpdate = form => { this.form = form }
  handleSubmit = prop => {
    if (!this.form[prop]) return
    if (!this.form[prop].valid) return
    if (this.form[prop].value === this.form[prop].initialValue) return
    this.userChangeRequested = true
    this.props.dispatch(change(this.user, prop, this.form[prop].value))
    this.formDispatch(actions.load(`local.${prop}`, this.form[prop].value))
    this.formDispatch(actions.reset(`local.${prop}`))
  }

  userChanged = () => {
    return this.success && this.userChangeRequested
  }

  render () {
    if (!this.autologinComplete) return <Loading>Loading …</Loading>
    if (!this.me) return <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
    if (!this.me.superUser) return <AccessDenied />
    if (!this.user) return <Loading>Loading User …</Loading>
    return (<ContainerRow>
      <FormCard>
        <LocalForm
          initialState={this.getFormModel()}
          getDispatch={(dispatch) => this.attachDispatch(dispatch)}
          onUpdate={this.handleUpdate}
        >
          <div className='card-header'>
            <h1 className='card-title'>
              { this.user.avatar
                ? <img src={this.user.avatar} className='avatar' alt={`${this.user.firstname} ${this.user.lastname}`} />
                : <i className='material-icons'>person</i>
              }
              {this.user.firstname} {this.user.lastname}
            </h1>
          </div>
          <div className='card-block'>
            <dl>
              <dt>Activated</dt>
              <dd>
                { this.user.active && (
                  <span>
                    <i className='material-icons success'>check_box</i>
                    <span>Yes</span>
                    <AppButton component={AppButton} submitting={this.changing} valid onClick={this.toggleActive} right icon='block'>deactivate</AppButton>
                  </span>
                )}
                { !this.user.active && (
                  <span>
                    <i className='material-icons danger'>block</i>
                    <span>No</span>
                    <AppButton component={AppButton} submitting={this.changing} valid onClick={this.toggleActive} right icon='check_box'>activate</AppButton>
                  </span>
                )}
              </dd>
              <dt>SuperUser</dt>
              <dd>
                { this.user.superUser && (
                  <span>
                    <i className='material-icons success'>check_box</i>
                    <span>Yes</span>
                  </span>
                )}
                { !this.user.superUser && (
                  <span>
                    <i className='material-icons danger'>block</i>
                    <span>No</span>
                  </span>
                )}
              </dd>
            </dl>
            <RRFField
              name='email'
              tabIndex='1'
              required
              email
              disabled={this.changing}
              onBlur={() => { this.handleSubmit('email') }}
              label='email address'
            />
            <RRFField
              name='firstname'
              tabIndex='2'
              required
              disabled={this.changing}
              onBlur={() => { this.handleSubmit('firstname') }}
              label='first name'
            />
            <RRFField
              name='lastname'
              tabIndex='3'
              required
              disabled={this.changing}
              onBlur={() => { this.handleSubmit('lastname') }}
              label='last name'
            />
          </div>
          { (this.error || this.userChanged()) && (
            <div className='card-footer'>
              { this.userChanged() && (
                <div className='success-info'>
                  <div className='alert alert-success' role='alert'>
                    <i className='material-icons'>check_ok</i> Changes saved …
                  </div>
                </div>
              )}
              { this.error && <GenericError problem={this.error} /> }
            </div>
          ) }
        </LocalForm>
      </FormCard>
    </ContainerRow>)
  }
}
