import React from 'react'
import { Redirect } from 'react-router-dom'
import { ContainerRow } from '../../app/form-components'
import AdminUsersList from './AdminUsersList'
import AdminCreateUser from './AdminCreateUser'
import AccessDenied from '../../app/AccessDenied'

export default class AdminUsersScreen extends React.Component {
  constructor (props) {
    super(props)
    this.pathname = props.location.pathname
    this.autologinComplete = props.autologinComplete
    this.me = props.me
    this.query = props.query
  }

  componentWillReceiveProps ({autologinComplete, me, query}) {
    if (autologinComplete) {
      this.autologinComplete = autologinComplete
      this.me = me
      this.query = query
    }
  }

  render () {
    if (!this.autologinComplete) return null
    return this.me
      ? (<ContainerRow>
        { this.me.superUser && <AdminUsersList {...this.props} /> }
        { this.me.superUser && <AdminCreateUser {...this.props} /> }
        { !this.me.superUser && <AccessDenied /> }
      </ContainerRow>)
      : <Redirect to={{pathname: '/login', returnTo: this.pathname}} />
  }
}
