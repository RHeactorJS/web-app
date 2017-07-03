/* global URLSearchParams */

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
import { AccountNotFoundError } from './Login'
import { success, error } from '../state/activation'

export default class ActivationScreen extends React.Component {
  constructor (props) {
    super(props)
    this.apiClient = new API(props.apiIndex, props.mimeType)
    this.activated = props.activated
    this.activationProblem = props.activationProblem
    this.token = props.location.search && new URLSearchParams(props.location.search).get('token')
    this.dispatch = props.dispatch
  }

  componentWillReceiveProps ({activated, activationProblem}) {
    this.activated = activated
    this.activationProblem = activationProblem
  }

  componentWillMount () {
    const userClient = new GenericModelAPIClient(this.apiClient, User)
    return this.apiClient.index()
      .then(index => JSONLD.getRelLink('activate-account', index))
      .then(uri => userClient.create(uri, {}, new JsonWebToken(this.token)))
      .then(() => this.dispatch(success()))
      .catch(err => this.dispatch(error(err)))
  }

  render () {
    return (
      <FormCard>
        <FormHeader submitSucceeded={this.activated} icon='person_add'>Activation</FormHeader>
        <div className='card-block'>
          { this.activated && (
            <div className='alert alert-success' role='alert'>
              <p>Awesome, your account has been activated!</p>
              <p>You can now <Link to='/login' className='text-nowrap'>log in</Link> with your email address and password.</p>
            </div>
          )}
          { !this.activated && !this.activationProblem && (
            <p className='card-text'>
              <i className='material-icons spin'>hourglass_empty</i> Verifying your token …
            </p>
          )}
          { this.activationProblem && (
            <p className='card-text'>
              <i className='material-icons'>error</i> Verification of your token failed.
            </p>
          )}
        </div>
        { this.activationProblem && (
          <div className='card-footer'>
            { this.activationProblem && <GenericError problem={this.activationProblem} /> }
          </div>
        )}
      </FormCard>
    )
  }
}
