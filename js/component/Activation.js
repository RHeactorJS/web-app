/* global URLSearchParams */

import React from 'react'
import { Link } from 'react-router-dom'
import { JsonWebToken, User } from '@rheactorjs/models'
import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { API } from '../service/api'
import { ContainerRow, FormCard, FormHeader, GenericError } from './form-components'

export default class ActivationScreen extends React.Component {
  constructor (props) {
    super(props)
    this.apiClient = new API(props.apiIndex, props.mimeType)
    this.activated = props.activated
    this.problem = props.problem
    this.token = props.location.search && new URLSearchParams(props.location.search).get('token')
    this.onSuccess = props.onSuccess
    this.onError = props.onError
  }

  componentWillReceiveProps ({activated, problem}) {
    this.activated = activated
    this.problem = problem
  }

  componentWillMount () {
    const userClient = new GenericModelAPIClient(this.apiClient, User)
    return this.apiClient.index()
      .then(index => JSONLD.getRelLink('activate-account', index))
      .then(uri => userClient.create(uri, {}, new JsonWebToken(this.token)))
      .then(() => this.onSuccess())
      .catch(err => this.onError(err))
  }

  render () {
    return (
      <ContainerRow>
        <FormCard>
          <FormHeader submitSucceeded={this.activated} icon='person_add'>Activation</FormHeader>
          <div className='card-block'>
            { this.activated && (
              <div className='alert alert-success' role='alert'>
                <p>Awesome, your account has been activated!</p>
                <p>You can now <Link to='/login' className='text-nowrap'>log in</Link> with your email address and password.</p>
              </div>
            )}
            { !this.activated && !this.problem && (
              <p className='card-text'>
                <i className='material-icons spin'>hourglass_empty</i> Verifying your token …
              </p>
            )}
            { this.problem && (
              <p className='card-text'>
                <i className='material-icons'>error</i> Verification of your token failed.
              </p>
            )}
          </div>
          { this.problem && (
            <div className='card-footer'>
              { this.problem && <GenericError problem={this.problem} /> }
            </div>
          )}
        </FormCard>
      </ContainerRow>
    )
  }
}
