import React from 'react'
import { Redirect } from 'react-router-dom'

export default ({token}) => {
  if (!token) return <Redirect to={{pathname: '/login'}} />
  return null
}
