import React from 'react'
import { Redirect } from 'react-router-dom'

export default ({token, location}) => {
  if (!token) return <Redirect to={{pathname: '/login', returnTo: location.pathname}} />
  return null
}
