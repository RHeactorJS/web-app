/* global URLSearchParams */

import React from 'react'
import { Redirect } from 'react-router-dom'
import { JsonWebToken, User } from '@rheactorjs/models'
import { GenericModelAPIClient } from '../service/generic-api-client'
import { JSONLD } from '../util/jsonld'
import { API } from '../service/api'
import { ContainerRow, FormCard, FormHeader, GenericError } from './form-components'

export default class AccountEmailChangeConfirmScreen extends React.Component {
  constructor (props) {
    super(props)
    this.apiClient = new API(props.apiIndex, props.mimeType)
    this.confirmed = props.confirmed
    this.problem = props.problem
    this.token = props.location.search && new URLSearchParams(props.location.search).get('token')
    this.user = props.user
    this.autologinComplete = props.autologinComplete
    this.onSuccess = props.onSuccess
    this.onError = props.onError
    this.userClient = new GenericModelAPIClient(this.apiClient, User)
    this.fetched = false
  }

  componentWillReceiveProps ({autologinComplete, user, confirmed, problem}) {
    this.confirmed = confirmed
    this.problem = problem
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.user = user
      if (user && !this.fetched) {
        this.fetched = true
        const t = new JsonWebToken(this.token)
        this.userClient.update(JSONLD.getRelLink('change-email-confirm', this.user), {}, this.user.$version, t)
          .then(() => this.onSuccess(t))
          .catch(err => this.onError(err))
      }
    }
  }

  render () {
    if (!this.autologinComplete) return null
    return this.user
      ? (<ContainerRow>
        <FormCard>
          <FormHeader submitSucceeded={this.confirmed} icon='person'>Change email address</FormHeader>
          <div className='card-block'>
            { this.confirmed && (
              <div className='alert alert-success' role='alert'>
                <p>Your new email address is now active.</p>
              </div>
            )}
            { !this.confirmed && !this.problem && (
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
      </ContainerRow>)
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
  }
}
