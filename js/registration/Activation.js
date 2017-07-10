/* global URLSearchParams */

import React from 'react'
import { Link } from 'react-router-dom'
import { ContainerRow, FormCard, FormHeader, GenericError } from '../app/form-components'
import { activate } from './actions'

export default class ActivationScreen extends React.Component {
  constructor (props) {
    super(props)
    this.token = props.location.search && new URLSearchParams(props.location.search).get('token')
  }

  componentWillMount () {
    this.props.dispatch(activate(this.token))
  }

  componentWillReceiveProps ({activated, error}) {
    this.activated = activated
    this.error = error
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
            { !this.activated && !this.error && (
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
      </ContainerRow>
    )
  }
}
