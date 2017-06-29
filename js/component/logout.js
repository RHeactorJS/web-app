import React from 'react'
import { Redirect } from 'react-router-dom'

class LogoutScreen extends React.Component {
  constructor (props) {
    super(props)
    this.onLogout = props.onLogout
  }

  componentWillMount () {
    this.onLogout()
  }

  render () {
    return (
      <Redirect to={{pathname: '/login', state: {from: 'logout'}}} />
    )
  }
}

export default LogoutScreen
