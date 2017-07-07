import React from 'react'
import { Redirect } from 'react-router-dom'
import { logout } from '../state/auth'

class LogoutScreen extends React.Component {
  componentWillMount () {
    this.props.dispatch(logout())
  }

  render () {
    return (
      <Redirect to={{pathname: '/login', state: {from: 'logout'}}} />
    )
  }
}

export default LogoutScreen
