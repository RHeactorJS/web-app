import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

export default ({loggedIn, appName, connected}) => {
  return (
    <nav className='navbar navbar-toggleable-sm navbar-inverse bg-primary fixed-top'>
      <button className='navbar-toggler navbar-toggler-right'
        type='button'
        data-toggle='collapse'
        data-target='#mainnavbar'
        aria-controls='mainnavbar'
        aria-expanded='false'
        aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon' />
      </button>
      <a className='navbar-brand' href='/'>{appName}</a>
      <div className='collapse navbar-collapse' id='mainnavbar'>
        <ul className='navbar-nav mr-auto mt-2 mt-sm-0'>
          <li className='nav-item'>
            <Link to='/' className='nav-link'>
              Home
            </Link>
          </li>
        </ul>
        <ul className='navbar-nav ml-auto mt-2 mt-sm-0'>
          <li className='nav-item'>
            <abbr className={classNames({'nav-link': true, 'connection-error': true, ok: connected, error: !connected})}>
              {
                connected
                ? <i className='material-icons spin' title='Connection ok'>sync</i>
                : <i className='material-icons danger' title='Connection failed …'>sync_problem</i>
              }
            </abbr>
          </li>
          <li className='nav-item'>
            <Link to='/register' className='nav-link'>
              <i className='material-icons'>person_add</i>
              <span>Register</span>
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/login' className='nav-link'>
              <i className='material-icons'>person</i>
              <span>Login</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
