import React from 'react'
import { Redirect } from 'react-router-dom'
import { FormHeader, FormCard, ContainerRow } from '../app/form-components'
import AdminUsersList from './AdminUsersList'
import AdminCreateUser from './AdminCreateUser'

export default class AdminUsersScreen extends React.Component {
  constructor (props) {
    super(props)
    this.pathname = props.location.pathname
    this.autologinComplete = props.autologinComplete
    this.user = props.user
  }

  componentWillReceiveProps ({autologinComplete, user, userQuery}) {
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.user = user
      this.userQuery = userQuery
    }
  }

  render () {
    if (!this.autologinComplete) return null
    return (this.user)
      ? (<ContainerRow>
        { this.user.superUser && <AdminUsersList {...this.props} /> }
        { this.user.superUser && <AdminCreateUser {...this.props} /> }
        { !this.user.superUser && (
          <FormCard>
            <FormHeader icon='lock'>Access Denied</FormHeader>
            <div className='card-block'>
              <div className='alert alert-danger' role='alert'>
                <i className='material-icons'>warning</i> You are not allowed to access this section!
              </div>
            </div>
          </FormCard>)
        }
      </ContainerRow>)
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
  }
}
