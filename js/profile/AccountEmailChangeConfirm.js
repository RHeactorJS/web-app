/* global URLSearchParams */

import React from 'react'
import { ContainerRow, FormCard, FormHeader, GenericError } from '../app/form-components'
import { confirmEmailChange } from './actions'

export default class AccountEmailChangeConfirmScreen extends React.Component {
  constructor (props) {
    super(props)
    this.token = props.location.search && new URLSearchParams(props.location.search).get('token')
    this.submitted = false
  }

  componentWillReceiveProps ({success, error, autologinComplete}) {
    this.success = success
    this.error = error
    if (autologinComplete && !this.submitted) {
      this.submitted = true
      this.props.dispatch(confirmEmailChange(this.token))
    }
  }

  render () {
    return (<ContainerRow>
      <FormCard>
        <FormHeader submitSucceeded={this.success} icon='person'>Change email address</FormHeader>
        <div className='card-block'>
          { this.success && (
            <div className='alert alert-success' role='alert'>
              Your new email address is now active.
            </div>
          )}
          { !this.success && !this.error && (
            <p className='card-text'>
              <i className='material-icons spin'>hourglass_empty</i> Verifying your token …
            </p>
          )}
          { this.error && (
            <p className='card-text'>
              <i className='material-icons'>error</i> Verification of your token failed.
            </p>
          )}
        </div>
        { this.error && (
          <div className='card-footer'>
            { this.error && <GenericError problem={this.error} /> }
          </div>
        )}
      </FormCard>
    </ContainerRow>)
  }
}
